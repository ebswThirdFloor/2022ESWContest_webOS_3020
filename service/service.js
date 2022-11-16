const pkgInfo = require("./package.json");
const Service = require("webos-service");
const spawn = require("child_process").spawn;
const fs = require("fs");
const service = new Service(pkgInfo.name);

const logHeader = "[" + pkgInfo.name + "]";
const filePath = process.cwd();
const imagePath = "/tmp/thirdfloor/";
const intervaltime = 1000;
const captureParam = {
  width: 640,
  height: 480,
  format: "JPEG",
  mode: "MODE_ONESHOT",
};
const recordNum = 3;

let interval;
let subscription;
let cameraId;
let handle;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

service.register("identify", async function (message) {
  console.log(logHeader, "SERVICE_METHOD_CALLED:/identify");
  const spawnPythonProcess = async () => {
    const pythonProcess = spawn("python3", ["./test.py"]);
    let data = "";
    for await (const chunk of pythonProcess.stdout) {
      data += chunk;
    }
    let error = "";
    for await (const chunk of pythonProcess.stderr) {
      data += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
      pythonProcess.on("close", resolve);
    });
    if (exitCode) throw new Error(`error: exit code ${exitCode}, ${error}`);
    return data;
  };
  try {
    const res = await spawnPythonProcess();
    message.respond({ Response: res });
  } catch (err) {
    console.error(err);
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
    console.error("interval undefined");
    return;
  }
  console.log(logHeader, "create_interval");
  interval = setInterval(async function () {
    try {
      await capture(captureParam);
      fs.readdir(imagePath, (err, files) => {
        if (err) console.error(err);
        // console.log(files);
        files.forEach((file) => fs.unlinkSync(imagePath + file));
      });
    } catch (e) {
      console.error(e);
    }
  }, intervaltime);
}

function capture(captureParam) {
  return new Promise((resolve, reject) => {
    if (!handle)
      reject({
        returnValue: false,
        errorText: "handle value undefined",
      });
    service.call("luna://com.webos.service.camera2/startPreview", { handle, params: { type: "sharedmemory", source: "0" } }, (startPreviewResponse) => {
      if (!startPreviewResponse.payload.returnValue) {
        reject(startPreviewResponse);
        return;
      } else {
        key = startPreviewResponse.payload.key;
        service.call("luna://com.webos.service.camera2/startCapture", { handle, params: captureParam, path: imagePath }, (captureResponse) => {
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

async function setDir() {
  const oldmask = process.umask(0);
  const result = await Promise.all(
    [filePath + "/users", imagePath].map(
      (path) =>
        new Promise((resolve, reject) => {
          fs.mkdir(path, "1777", (err) => {
            if (err && err.code != "EEXIST") reject(error);
            else resolve(null);
          });
        })
    )
  );
  process.umask(oldmask);
  return result;
}

service.register("record", async function (message) {
  try {
    await openCamera();
    for (var i = 0; i < recordNum; i++) {
      await capture(captureParam);
      await sleep(500);
    }
    await closeCamera();
    message.respond({
      returnValue: true,
    });
  } catch (e) {
    console.error(e);
    message.respond({
      returnValue: false,
      errorText: e.errorText,
    });
  }
});

function openCamera() {
  return new Promise((resolve, reject) => {
    service.call("luna://com.webos.service.camera2/getCameraList", {}, function (cameraListResponse) {
      const deviceList = cameraListResponse.payload.deviceList;
      if (deviceList.length === 0 || !cameraListResponse.payload.returnValue) {
        reject({
          returnValue: false,
          errorText: "camera not found",
        });
      } else {
        cameraId = deviceList[0].id;
        service.call("luna://com.webos.service.camera2/open", { id: cameraId }, function (openResponse) {
          if (!openResponse.payload.returnValue) {
            reject({
              returnValue: false,
              errorCode: openResponse.payload.errorCode,
              errorText: openResponse.payload.errorText,
            });
          } else {
            handle = openResponse.payload.handle;
            resolve({
              returnValue: true,
              Response: `camera handle vaule: ${handle}`,
            });
          }
        });
      }
    });
  });
}

function closeCamera() {
  return new Promise((resolve, reject) => {
    service.call("luna://com.webos.service.camera2/close", { handle }, function (response) {
      cameraId = handle = undefined;
      if (response.payload.returnValue) {
        resolve({
          returnValue: true,
          Response: "camera closed",
        });
      } else {
        reject({
          returnValue: false,
          errorCode: response.errorCode,
          errorText: response.errorText,
        });
      }
    });
  });
}

service.register("start", async function (message) {
  try {
    await setDir();
  } catch (e) {
    console.error(e);
    message.respond({
      returnValue: false,
      errorText: "mkdir failed",
    });
    return;
  }
  await openCamera();
  subscription = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, { subscribe: true });
  message.respond({
    returnValue: true,
    Response: "service has been started.",
  });
});

service.register("stop", async function (message) {
  if (subscription === undefined) {
    message.respond({
      returnValue: false,
      Response: "service hasn't been started yet.",
    });
  } else {
    subscription.cancel();
    subscription = undefined;
    await closeCamera();
  }
});
