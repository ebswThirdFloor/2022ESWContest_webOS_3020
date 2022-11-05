/*
 * Copyright (c) 2020-2022 LG Electronics Inc.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// helloworld_webos_service.js
// is simple service, based on low-level luna-bus API

// eslint-disable-next-line import/no-unresolved
const pkgInfo = require("./package.json");
const Service = require("webos-service");
const spawn = require("child_process").spawn;
const axios = require("axios");

const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = "[" + pkgInfo.name + "]";

service.register("ping", function (message) {
  axios.post("localhost:3000", { message: "Ping" });
  console.log(logHeader, "SERVICE_METHOD_CALLED:/ping");
  console.log("Ping! setting up activity");
  const methodName = "luna://" + pkgInfo.name + "/pong";
  const activitySpec = {
    activity: {
      name: "ping pong", // this needs to be unique, per service
      description: "ping and pong", // required
      type: { foreground: true, persist: false, explicit: true },
      callback: {
        // what service to call when this activity starts
        method: methodName, // URI to service
      },
    },
    start: true, // start the activity immediately when its requirements (if any) are met
    replace: true, // if an activity with the same name already exists, replace it
    subscribe: true, // if "subscribe" is false, the activity needs to be adopted immediately, or it gets canceled
  };
  service.call("luna://com.webos.service.activitymanager/create", activitySpec, function (reply) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:com.webos.service.activitymanager/create");
    console.log("activitySpec: ", activitySpec);
    const activityId = reply.payload.activityId;
    console.log("ActivityId = " + activityId);
    service.call("luna://com.webos.service.activitymanager/getActivityInfo", { activityId: activityId, current: true }, function (activityInfo) {
      console.log("Acitivity Info: ", activityInfo);
    });
    message.respond({ msg: "Created activity " + activityId });
  });
});

service.register("pong", function (message) {
  console.log(logHeader, "SERVICE_METHOD_CALLED:/pong");
  console.log("Pong!");
  console.log(message.payload);
  axios.post("localhost:3000", { message: "Pong" });
  message.respond({ message: "Pong" });
});

service.register("/do/re/me", function (message) {
  console.log(logHeader, "SERVICE_METHOD_CALLED://do/re/me");
  message.respond({ verses: [{ doe: "a deer, a female deer" }, { ray: "a drop of golden sun" }, { me: "a name I call myself" }] });
});

service.register("recognization", async function (message) {
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
