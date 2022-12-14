const pkgInfo = require("./package.json");
const Service = require("webos-service");
const fs = require("fs");
const axios = require("axios");
const qs = require("qs");
const FormData = require("form-data");
const service = new Service(pkgInfo.name);

const SERVER_URL = "http://165.246.44.130:3000/";
const fsPromises = fs.promises;
const logHeader = "[" + pkgInfo.name + "]";
const imgPath = process.cwd() + "/tmp/";

let subscription;

const camera = {
  handle: undefined,

  getCameraList: function () {
    // console.log(logHeader, "getCameraList");
    return new Promise((resolve, rejects) => {
      service.call("luna://com.webos.service.camera2/getCameraList", {}, async (res) => {
        console.log("getCameraList", res.payload);
        if (res.payload.returnValue) {
          if (res.payload.deviceList.length === 0) {
            await utils.sendNotification("카메라가 연결되지 않았습니다");
            rejects(res.payload);
          } else resolve(res.payload);
        } else {
          rejects(res.payload);
        }
      });
    });
  },

  cameraOpen: (id) => {
    // console.log(logHeader, "cameraOpen");
    return new Promise((resolve, rejects) => {
      service.call("luna://com.webos.service.camera2/open", { id }, async (res) => {
        console.log("cameraOpen", res.payload);
        if (res.payload.returnValue) {
          resolve(res.payload);
        } else {
          await utils.sendNotification("카메라 오류: open");
          rejects(res.payload);
        }
      });
    });
  },

  cameraClose: (handle) => {
    // console.log(logHeader, "cameraClose");
    return new Promise((resolve, rejects) => {
      service.call("luna://com.webos.service.camera2/close", { handle }, async (res) => {
        console.log("cameraClose", res.payload);
        if (res.payload.returnValue) {
          resolve(res.payload);
        } else {
          await utils.sendNotification("카메라 오류: close");
          rejects(res.payload);
        }
      });
    });
  },

  startPreview: (handle, params = { type: "sharedmemory", source: "0" }) => {
    // console.log(logHeader, "startPreview");
    return new Promise((resolve, rejects) => {
      service.call("luna://com.webos.service.camera2/startPreview", { handle, params }, async (res) => {
        console.log("startPreview", res.payload);
        if (res.payload.returnValue) {
          resolve(res.payload);
        } else {
          await utils.sendNotification("카메라 오류: startPreview");
          rejects(res.payload);
        }
      });
    });
  },

  stopPreview: (handle) => {
    // console.log(logHeader, "stopPreview");
    return new Promise((resolve, rejects) => {
      service.call("luna://com.webos.service.camera2/stopPreview", { handle }, async (res) => {
        console.log("stopPreview", res.payload);
        if (res.payload.returnValue) {
          resolve(res.payload);
        } else {
          await utils.sendNotification("카메라 오류: stopPreview");
          rejects(res.payload);
        }
      });
    });
  },

  startCapture: (
    handle,
    path,
    params = {
      width: 640,
      height: 480,
      format: "JPEG",
      mode: "MODE_ONESHOT",
    }
  ) => {
    // console.log(logHeader, "startCapture");
    return new Promise((resolve, rejects) => {
      service.call("luna://com.webos.service.camera2/startCapture", { handle, path, params }, async (res) => {
        console.log("startCapture", res.payload);
        if (res.payload.returnValue) {
          resolve(res.payload);
        } else {
          await utils.sendNotification("카메라 오류: startCapture");
          rejects(res.payload);
        }
      });
    });
  },

  stopCapture: (handle) => {
    // console.log(logHeader, "stopCapture");
    return new Promise((resolve, rejects) => {
      service.call("luna://com.webos.service.camera2/stopCapture", { handle }, async (res) => {
        console.log("stopCapture", res.payload);
        if (res.payload.returnValue) {
          resolve(res.payload);
        } else {
          await utils.sendNotification("카메라 오류: stopCapture");
          rejects(res.payload);
        }
      });
    });
  },
};

class HeartBeat {
  heartbeat = undefined;
  subscription = undefined;
  interval = undefined;

  start() {
    this.subscription = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, { subscribe: true });
  }

  stop() {
    if (subscription !== undefined) {
      this.subscription.cancel();
      this.subscription = undefined;
    }
  }

  constructor(intervalFunc) {
    this.heartbeat = service.register("heartbeat");

    this.heartbeat.on("request", async function (message) {
      console.log(logHeader, "heartbeat/request");
      if (message.isSubscription && !this.interval) {
        console.log(logHeader, "createInterval");
        this.interval = setInterval(async () => {
          try {
            await intervalFunc();
          } catch (err) {
            console.error(err);
          }
        }, 3000);
        message.respond({ returnValue: true });
      } else {
        await utils.sendNotification("서비스 오류: heartbeat request");
        message.respond({ returnValue: false });
      }
    });

    this.heartbeat.on("cancel", async function (message) {
      console.log(logHeader, "heartbeat/cancel");
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = undefined;
        message.respond({ returnValue: true });
      } else {
        await utils.sendNotification("서비스 오류: heartbeat cancel");
        message.respond({ returnValue: false });
      }
    });
  }
}

const users = {
  userJson: process.cwd() + "/user.json",

  async getUserID(userInfo, image) {
    console.log(logHeader, "getUserID");
    const imageSrc = image.src.replace(/^data:image\/jpeg;base64,/, "");
    const data = new FormData();
    data.append("image", Buffer.from(imageSrc, "base64"), "image.jpeg");
    data.append("userInfo", JSON.stringify(userInfo));
    const config = {
      method: "post",
      url: SERVER_URL + "user",
      headers: {
        ...data.getHeaders(),
      },
      data,
    };
    const res = await axios(config);
    return res.data.userID;
  },

  async setActiveUser(userID) {
    console.log(logHeader, "setActiveUser");
    const json = {
      activeUser: userID,
    };
    await fsPromises.writeFile(users.userJson, JSON.stringify(json));
  },

  async getActiveUser() {
    console.log(logHeader, "getActiveUser");
    return JSON.parse(await fsPromises.readFile(users.userJson));
  },

  addUser(userInfo, image) {
    console.log(logHeader, "addUser");
    return new Promise(async (resolve, reject) => {
      const userID = await this.getUserID(userInfo, image);
      if (userID) {
        await this.setActiveUser(userID);
        resolve(userID);
      } else {
        reject(true);
      }
    });
  },

  async deleteUser(userID) {
    console.log(logHeader, "deleteUser");
    const { activeUser } = JSON.parse(await getActiveUser());
    if (activeUser === userID) setActiveUser(undefined);
    const data = qs.stringify({ userID });
    const config = {
      method: "delete",
      url: SERVER_URL + "user",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    await axios(config);
  },
};

const utils = {
  sleep: (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  clean: async (path) => {
    await fsPromises.rmdir(path, { recursive: true });
    await fsPromises.mkdir(path);
  },
  upload: async (imgPath, activeUser) => {
    const image = fs.createReadStream(imgPath);
    const data = new FormData();
    data.append("image", image);
    data.append("userID", activeUser);
    const config = {
      method: "post",
      url: SERVER_URL + "take",
      headers: {
        ...data.getHeaders(),
      },
      data,
    };
    await axios(config);
  },
  make: async (userID) => {
    const config = {
      method: "get",
      url: SERVER_URL + `contents?userID=${userID}`,
    };
    await axios(config);
  },
  sendNotification: async (message) => {
    return new Promise((resolve, rejects) => {
      service.call("luna://com.webos.notification/createToast", { message }, (res) => {
        console.log("createToast", res.payload);
        if (res.payload.returnValue) {
          resolve(res.payload);
        } else {
          rejects(res.payload);
        }
      });
    });
  },
};

const schedule = {
  setSchedule(time) {
    return new Promise((resolve, rejects) => {
      service.call(
        "luna://com.webos.service.alarm/set",
        { key: "com.third.floor", uri: "luna://" + pkgInfo.name + "/start", params: {}, in: time },
        async (res) => {
          console.log("setSchedule", res.payload);
          if (res.payload.returnValue) {
            resolve(res.payload);
          } else {
            await utils.sendNotification("서비스 오류: alarm set");
            rejects(res.payload);
          }
        }
      );
    });
  },
  clearSchedule() {
    return new Promise((resolve, rejects) => {
      service.call("luna://com.webos.service.alarm/clear", { key: "com.third.floor" }, async (res) => {
        console.log("clearSchedule", res.payload);
        if (res.payload.returnValue) {
          resolve(res.payload);
        } else {
          await utils.sendNotification("서비스 오류: alarm clear");
          rejects(res.payload);
        }
      });
    });
  },
};

const prepareCamera = () => {
  return new Promise(async (resove, reject) => {
    const cameraList = await camera.getCameraList();
    if (cameraList.returnValue && cameraList.deviceList.length > 0) {
      const cameraId = cameraList.deviceList[0].id;
      const { handle } = await camera.cameraOpen(cameraId);
      await utils.sleep(3000);
      resove(handle);
    } else reject(undefined);
  });
};

const capture = async (handle, path, activeUser) => {
  console.log("capture called");
  let returnValue = false;
  try {
    await camera.startPreview(handle);
    await utils.sleep(1000);
    await utils.clean(imgPath);
    await camera.startCapture(handle, path);
    const fileList = await fsPromises.readdir(imgPath);
    if (fileList.length > 0) {
      await utils.upload(imgPath + fileList[0], activeUser);
      returnValue = true;
    }
  } catch (e) {
    console.error(e);
  } finally {
    await camera.stopPreview(handle);
    return returnValue;
  }
};

service.register("start", async (message) => {
  console.log(logHeader, "start");
  const { activeUser } = JSON.parse(await fsPromises.readFile(users.userJson));
  if (activeUser === undefined) {
    message.respond({
      returnValue: false,
    });
  } else {
    camera.handle = await prepareCamera();
    subscription = new HeartBeat(async () => {
      await capture(camera.handle, imgPath, activeUser);
    });
    subscription.start();
    message.respond({
      returnValue: true,
    });
  }
});

service.register("stop", async (message) => {
  console.log(logHeader, "stop");
  if (subscription === undefined) {
    message.respond({
      returnValue: false,
    });
  } else {
    subscription.stop();
    await camera.cameraClose(camera.handle);
    message.respond({
      returnValue: true,
    });
  }
  message.respond({
    returnValue: true,
  });
});

service.register("demo", async (message) => {
  console.log(logHeader, "demo");
  const { activeUser } = JSON.parse(await fsPromises.readFile(users.userJson));
  if (activeUser === undefined) {
    message.respond({
      returnValue: false,
    });
  } else {
    try {
      camera.handle = await prepareCamera();
      let i = 1;
      while (true) {
        const captureSuccess = await capture(camera.handle, imgPath, activeUser);
        await utils.sendNotification(`${i}번째 사진이 촬영되었습니다.`);
        if (captureSuccess) {
          if (i++ >= 3) break;
        }
        await utils.sleep(3000);
      }
      await camera.cameraClose(camera.handle);
      await utils.make(activeUser);
      await utils.sendNotification(`성장일기가 생성되었습니다.`);
      message.respond({
        returnValue: true,
      });
    } catch (err) {
      console.error(err);
      message.respond({
        returnValue: false,
      });
    }
  }
});

service.register("addUser", async (message) => {
  console.log(logHeader, "addUser");
  const { userInfo, image } = message.payload;
  try {
    await users.addUser(userInfo, image);
    message.respond({
      returnValue: true,
    });
  } catch (err) {
    console.error(err);
    message.respond({
      returnValue: false,
    });
  }
});

service.register("deleteUser", async (message) => {
  console.log(logHeader, "deleteUser");
  const { userID } = message.payload;
  try {
    await users.deleteUser(userID);
    message.respond({
      returnValue: true,
    });
  } catch (err) {
    console.error(err);
    message.respond({
      returnValue: false,
    });
  }
});

service.register("setSchedule", async (message) => {
  const { time } = message.payload;
  try {
    await schedule.setSchedule(time);
    message.respond({
      returnValue: true,
    });
  } catch (err) {
    console.error(err);
    message.respond({
      returnValue: false,
    });
  }
});

service.register("clearSchedule", async (message) => {
  try {
    await schedule.clearSchedule();
    message.respond({
      returnValue: true,
    });
  } catch (err) {
    console.error(err);
    message.respond({
      returnValue: false,
    });
  }
});
