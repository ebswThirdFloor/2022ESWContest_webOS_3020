import { useState, useRef, useCallback, useEffect } from "react";
import { Header, Panel } from "@enact/sandstone/Panels";
import { useNavigate, useMatch } from "react-router-dom";
import Webcam from "react-webcam";
import LS2Request from "@enact/webos/LS2Request";
import Button from "@enact/sandstone/Button";
import Card from "../../components/Card";
import Style from "./RegisterPhotoPanel.module.css";
import appInfo from "../../../webos-meta/appinfo.json";

const RegisterPhotoPanel = () => {
  const navigate = useNavigate();

  const match = useMatch("/register/photo/:nickname/:age/:gender");
  const userInfo = match?.params;
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = new LS2Request();

  const capture = useCallback(() => {
    if (webcamRef.current !== null) {
      const imageSrc = webcamRef.current.getScreenshot();
      const capturedImage = new Image();
      capturedImage.src = imageSrc || "";
      setImage(capturedImage);
    }
  }, [webcamRef]);
  useEffect(() => {
    if (canvasRef.current !== null && image) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.drawImage(image, 0, 0);
    }
  }, [canvasRef, image]);
  const submit = async () => {
    if (image) {
      try {
        // react-query 변경 예정
        console.log({
          userInfo: userInfo,
          image: {
            src: image.src,
            height: image.height,
            width: image.width,
          },
        });
        const option = {
          service: "com.webos.notification",
          method: "createToast",
          parameters: {
            sourceId: appInfo.id,
            message: "등록되었습니다",
          },
        };
        api.send(option);
      } catch (e) {
        throw new Error("네트워크 오류");
      }
    } else {
      throw new Error("사진을 촬영해주세요");
    }
  };

  return (
    <Panel>
      <Header title="사용자 등록" onClose={() => navigate("/register/info")} />
      <div className={Style.contentWrapper}>
        <Card align_items="flex-start" justify_content="flex_start">
          <h1 className={Style.title}>사용자 정보</h1>
          {image === null ? (
            <Webcam className={Style.webcam} audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={640} height={480} />
          ) : (
            <canvas className={Style.webcam} width={640} height={480} ref={canvasRef} />
          )}
          <div className={Style.btnWrapper}>
            {image == null ? (
              <Button size={"small"} icon={"samples"} iconPosition={"after"} onClick={capture}>
                촬영
              </Button>
            ) : (
              <Button size={"small"} icon={"samples"} iconPosition={"after"} onClick={() => setImage(null)}>
                재촬영
              </Button>
            )}
            <Button
              size={"small"}
              icon={"arrowsmallright"}
              iconPosition={"after"}
              onClick={async () => {
                try {
                  await submit();
                  navigate("/");
                } catch (e) {
                  const option = {
                    service: "com.webos.notification",
                    method: "createToast",
                    parameters: {
                      sourceId: appInfo.id,
                      message: (e as Error).message,
                    },
                  };
                  api.send(option);
                  console.error("error: ", (e as Error).message);
                }
              }}
            >
              제출
            </Button>
          </div>
        </Card>
      </div>
    </Panel>
  );
};

export default RegisterPhotoPanel;
