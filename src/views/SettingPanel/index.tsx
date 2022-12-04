import { useState } from "react";
import { Panel } from "@enact/sandstone/Panels";
import { useNavigate } from "react-router-dom";
import Button from "@enact/sandstone/Button";
import TimePicker from "@enact/sandstone/TimePicker";
import Style from "./SettingPanel.module.css";
import sendNotification from "../../luna_apis/sendNotification";
import Header from "../../components/Header";

const SettingPanel = () => {
  const navigate = useNavigate();
  const [date1, setDate1] = useState<Date>(new Date());
  const [date2, setDate2] = useState<Date>(new Date());

  const submit = () => {
    console.log("submit");
  };

  return (
    <Panel>
      <Header title="설정" onBackPressed={() => navigate(-1)} />
      <div className={Style.wrapper}>
        <div className={Style.innerWrapper}>
          <h1>촬영 활성화 시간</h1>
          <div className={Style.layout}>
            <div>
              <span className={Style.label}>시작시간</span>
              <div className={Style.timePickerWrapper}>
                <TimePicker value={date1} onChange={(e) => console.log(setDate1(e.value))} />
              </div>
            </div>
            <div>
              <span className={Style.label}>종료시간</span>
              <div className={Style.timePickerWrapper}>
                <TimePicker value={date2} onChange={(e) => console.log(setDate2(e.value))} />
              </div>
            </div>
          </div>
          <Button
            className={Style.next}
            size={"small"}
            icon={"arrowsmallright"}
            iconPosition={"after"}
            onClick={() => {
              sendNotification("설정 되었습니다.");
              submit();
              navigate(-1);
            }}
          >
            완료
          </Button>
        </div>
      </div>
    </Panel>
  );
};

export default SettingPanel;
