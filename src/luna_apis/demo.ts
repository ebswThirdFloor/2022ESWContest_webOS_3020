import LS2Request from "@enact/webos/LS2Request";

const api = new LS2Request();

const addUser = () => {
  const option = {
    service: "com.third.floor.service",
    method: "demo",
  };
  api.send(option);
};

export default addUser;
