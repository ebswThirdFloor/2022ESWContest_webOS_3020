const pkgInfo = require("./package.json");
const Service = require("webos-service");
const spawn = require("child_process").spawn;
const axios = require("axios");
const service = new Service(pkgInfo.name);

const logHeader = "[" + pkgInfo.name + "]";

let interval;
let subscription;

service.register("recognition", async function (message) {
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
    message.respond({ respond: res });
  } catch (err) {
    console.log(err);
    message.respond({ respond: "error" });
  }
});

const heartbeat = service.register("heartbeat");

heartbeat.on("request", function (message) {
  console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat/request");
  console.log("heartbeat message: ", message);
  message.respond({ event: "beat" });
  if (message.isSubscription) {
    if (!interval) {
      createInterval();
    }
  }
});

heartbeat.on("cancel", function (message) {
  console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat/cancel");
  clearInterval(interval);
  interval = undefined;
});

function createInterval() {
  if (interval) {
    return;
  }
  console.log(logHeader, "create_interval");
  interval = setInterval(function () {
    sendResponses();
  }, 1000);
}

function sendResponses() {
  console.log(logHeader, "send_response");
}

service.register("start", function (message) {
  subscription = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, { subscribe: true });
  subscription.addListener("response", function (payload) {
    console.log("payload: ", payload);
  });
  message.respond({
    returnValue: true,
    Response: "service has been started.",
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
    message.respond({
      returnValue: true,
      Response: "service has been stoped.",
    });
  }
});
