import { useState } from "react";
import { Header, Panel } from "@enact/sandstone/Panels";
import useNavigate from "../../hooks/useNavigate";
import LS2Request from "@enact/webos/LS2Request";
import Button from "@enact/sandstone/Button";
import TimePicker from "@enact/sandstone/TimePicker";
import Card from "../../components/Card";
import Style from "./SettingPanel.module.css";
import path from "../../path.json";
import appInfo from "../../../webos-meta/appinfo.json";

const SettingPanel = () => {
  const navigate = useNavigate();
  const api = new LS2Request();
  const [from, setFrom] = useState<Date>(new Date());
  const [to, setTo] = useState();

  const submit = () => {
    console.log("submit");
  };

  return (
    <Panel>
      <Header title="설정" onClose={() => navigate(path.main)} />
      <div className={Style.contentWrapper}>
        <Card align_items="flex-start" justify_content="flex_start">
          <h1>촬영 활성화 시간</h1>
          <div className={Style.layout}>
            <div>
              <span className={Style.label}>시작</span>
              <div className={Style.timePickerWrapper}>
                <TimePicker />
              </div>
            </div>
            <div>
              <span className={Style.label}>종료</span>
              <div className={Style.timePickerWrapper}>
                <TimePicker />
              </div>
            </div>
          </div>
          <Button
            className={Style.next}
            size={"small"}
            icon={"arrowsmallright"}
            iconPosition={"after"}
            onClick={() => {
              const option = {
                service: "com.webos.notification",
                method: "createToast",
                parameters: {
                  sourceId: appInfo.id,
                  message: "설정되었습니다",
                },
              };
              api.send(option);
              submit();
              navigate(path.main);
            }}
          >
            완료
          </Button>
        </Card>
      </div>
    </Panel>
  );
};

export default SettingPanel;
