import LS2Request from "@enact/webos/LS2Request";

const api = new LS2Request();

interface addUserProps {
  userInfo: {
    nickname: string;
    age: string;
    gender: number;
  };
  image: {
    src: string;
    height: number;
    width: number;
  };
}

const addUser = ({ userInfo, image }: addUserProps) => {
  const option = {
    service: "com.third.floor.service",
    method: "addUser",
    parameters: {
      userInfo,
      image: {
        src: image.src,
        height: image.height,
        width: image.width,
      },
    },
  };
  api.send(option);
};

export default addUser;
