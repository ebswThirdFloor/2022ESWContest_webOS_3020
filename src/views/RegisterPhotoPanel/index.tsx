import { useState, useRef, useCallback, useEffect } from "react";
import { Panel } from "@enact/sandstone/Panels";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import Button from "@enact/sandstone/Button";
import Style from "./RegisterPhotoPanel.module.css";
import path from "../../path.json";
import sendNotification from "../../luna_apis/sendNotification";
import addUser from "../../luna_apis/addUser";
import Header from "../../components/Header";

const RegisterPhotoPanel = () => {
  const navigate = useNavigate();

  const params = useParams();
  const userInfo = JSON.parse(params.userInfo);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        addUser({ userInfo, image });
      } catch (e) {
        throw new Error("네트워크 오류");
      }
    } else {
      throw new Error("사진을 촬영해주세요");
    }
  };

  return (
    <Panel>
      <Header title="사용자 등록" onBackPressed={() => navigate(path.register.info + encodeURIComponent(JSON.stringify(userInfo)), { replace: true })} />
      <div className={Style.wrapper}>
        <div className={Style.innerWrapper}>
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
                  sendNotification("등록되었습니다");
                  navigate(path.main);
                } catch (e) {
                  sendNotification((e as Error).message);
                }
              }}
            >
              제출
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default RegisterPhotoPanel;
