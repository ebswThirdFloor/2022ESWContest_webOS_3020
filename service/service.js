const pkgInfo = require("./package.json");
const Service = require("webos-service");
const spawn = require("child_process").spawn;
const fs = require("fs");
const service = new Service(pkgInfo.name);

const logHeader = "[" + pkgInfo.name + "]";

let interval;
let subscription;
let cameraId;
let handle;
const path = "/tmp/thirdfloor/";
const intervaltime = 1000;

service.register("recognition", async function (message) {
  console.log(logHeader, "SERVICE_METHOD_CALLED:/recognition");
  const spawnPythonProcess = async () => {
    const pythonProcess = spawn("python3", ["./test.py"]);
    console.log("process start", pythonProcess.pid, process.cwd());
    let data = "";
    for await (const chunk of pythonProcess.stdout) {
      console.log("stdout: ", chunk);
      data += chunk;
    }
    let error = "";
    for await (const chunk of pythonProcess.stderr) {
      console.log("stderr: ", chunk);
      data += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
      pythonProcess.on("close", resolve);
    });
    console.log("exitcode: ", exitCode);
    if (exitCode) throw new Error(`error: exit code ${exitCode}, ${error}`);
    return data;
  };
  try {
    const res = await spawnPythonProcess();
    message.respond({ Response: res });
  } catch (err) {
    console.log(err);
    message.respond({ errorText: "spawnPythonProcess error" });
  }
});

const heartbeat = service.register("heartbeat");

heartbeat.on("request", function (message) {
  console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat/request");
  if (message.isSubscription) {
    if (!interval) {
      createInterval();
    }
  }
  message.respond({ returnValue: true });
});

heartbeat.on("cancel", function (message) {
  console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat/cancel");
  clearInterval(interval);
  interval = undefined;
  message.respond({ returnValue: true });
});

function createInterval() {
  if (interval) {
    return;
  }
  console.log(logHeader, "create_interval");
  interval = setInterval(async function () {
    try {
      captureParam = {
        width: 640,
        height: 480,
        format: "JPEG",
        mode: "MODE_ONESHOT",
      };
      await capture(captureParam);
      fs.readdir(path, (err, files) => {
        if (err) console.error(err);
        console.log(files);
        files.forEach((file) => fs.unlinkSync(path + file));
      });
    } catch (e) {
      console.error(e);
    }
  }, intervaltime);
}

async function capture(captureParam) {
  return new Promise((resolve, reject) => {
    service.call("luna://com.webos.service.camera2/startPreview", { handle, params: { type: "sharedmemory", source: "0" } }, (startPreviewResponse) => {
      if (!startPreviewResponse.payload.returnValue) {
        reject(startPreviewResponse);
        return;
      } else {
        key = startPreviewResponse.payload.key;
        service.call("luna://com.webos.service.camera2/startCapture", { handle, params: captureParam, path }, (captureResponse) => {
          if (!captureResponse.payload.returnValue) {
            reject(captureResponse);
            return;
          } else {
            service.call("luna://com.webos.service.camera2/stopPreview", { handle }, (stopPreviewResponse) => {
              if (!stopPreviewResponse.payload.returnValue) reject(stopPreviewResponse);
              else resolve(stopPreviewResponse);
            });
          }
        });
      }
    });
  });
}

service.register("start", function (message) {
  service.call("luna://com.webos.service.camera2/getCameraList", {}, function (cameraListResponse) {
    const deviceList = cameraListResponse.payload.deviceList;
    if (deviceList.length === 0 || !cameraListResponse.payload.returnValue) {
      message.respond({
        returnValue: true,
        errorText: "camera not found",
      });
      return;
    } else {
      cameraId = deviceList[0].id;
      service.call("luna://com.webos.service.camera2/open", { id: cameraId }, function (openResponse) {
        if (!openResponse.payload.returnValue) {
          message.respond({
            returnValue: false,
            errorCode: openResponse.payload.errorCode,
            errorText: openResponse.payload.errorText,
          });
          return;
        }
        handle = openResponse.payload.handle;
        subscription = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, { subscribe: true });
        message.respond({
          returnValue: true,
          Response: "service has been started.",
        });
      });
    }
  });
});

service.register("stop", function (message) {
  if (subscription === undefined) {
    message.respond({
      returnValue: false,
      Response: "service hasn't been started yet.",
    });
  } else {
    subscription.cancel();
    subscription = undefined;
    service.call("luna://com.webos.service.camera2/close", { handle }, function (response) {
      if (response.payload.returnValue) {
        message.respond({
          returnValue: true,
          Response: "service has been stoped.",
        });
      } else {
        message.respond({
          returnValue: false,
          errorCode: response.errorCode,
          errorText: response.errorText,
        });
      }
    });
  }
});
