import { useState, useRef, useCallback, useEffect } from "react";
import { Header, Panel } from "@enact/sandstone/Panels";
import { useNavigate, useMatch } from "react-router-dom";
import Webcam from "react-webcam";
import Button from "@enact/sandstone/Button";
import Card from "../../components/Card";
import Style from "./RegisterPhotoPanel.module.css";

const RegisterPhotoPanel = () => {
  const navigate = useNavigate();

  const match = useMatch("/register/photo/:nickname/:age/:gender");
  const userInfo = match?.params;
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
      console.log({
        userInfo: userInfo,
        image: {
          src: image.src,
          height: image.height,
          width: image.width,
        },
      });
    }
  };

  return (
    <Panel>
      <Header title="사용자 등록" onClose={() => navigate(-1)} />
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
                  console.error("error: ", e);
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
