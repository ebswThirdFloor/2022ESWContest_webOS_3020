import LS2Request from "@enact/webos/LS2Request";
import appInfo from "../../webos-meta/appinfo.json";

const api = new LS2Request();

const sendNotification = (message: string) => {
  const option = {
    service: "com.webos.notification",
    method: "createToast",
    parameters: {
      sourceId: appInfo.id,
      message,
    },
  };
  api.send(option);
};

export default sendNotification;
