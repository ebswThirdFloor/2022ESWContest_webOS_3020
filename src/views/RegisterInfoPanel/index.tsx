import { useState } from "react";
import { Panel } from "@enact/sandstone/Panels";
import { useNavigate, useParams } from "react-router-dom";
import Input from "@enact/sandstone/Input";
import Picker from "@enact/sandstone/Picker";
import Button from "@enact/sandstone/Button";
import Style from "./RegisterInfoPanel.module.css";
import Header from "../../components/Header";
import { InputEvent, PickerEvent } from "../../../types/types";
import path from "../../path.json";
import sendNotification from "../../luna_apis/sendNotification";

const RegisterInfoPanel = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userInfo = params.userInfo && JSON.parse(params.userInfo);
  const [nickname, setNickname] = useState(userInfo?.nickname || "");
  const [age, setAge] = useState(userInfo?.age || "");
  const [gender, setGender] = useState(userInfo?.gender || 0);

  const submit = () => {
    if (nickname === "") {
      sendNotification("닉네임을 입력해주세요");
    } else if (age === "") {
      sendNotification("나이를 입력해주세요");
    } else {
      navigate(path.register.photo + encodeURIComponent(JSON.stringify({ nickname, age, gender })));
    }
  };

  return (
    <Panel>
      <Header title="Register" onBackPressed={() => navigate(-1)} />
      <div className={Style.wrapper}>
        <div className={Style.innerWrapper}>
          <h1>사용자 정보</h1>
          <div className={Style.layout}>
            <label>닉네임: </label>
            <div>
              <Input
                className={Style.input}
                placeholder="닉네임을 입력하세요"
                title="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname((e as unknown as InputEvent<string>).value)}
              />
            </div>
            <label>나이: </label>
            <div>
              <Input
                className={Style.input}
                placeholder="나이를 입력하세요"
                title="나이를 입력하세요"
                type="number"
                maxLength={2}
                value={age}
                onChange={(e) => setAge((e as unknown as InputEvent<string>).value)}
              />
            </div>
            <label>성별: </label>
            <Picker className={Style.switch} value={gender} onChange={(e: PickerEvent) => setGender(e.value)}>
              {["남성", "여성"]}
            </Picker>
          </div>
          <Button className={Style.next} size={"small"} icon={"arrowsmallright"} iconPosition={"after"} onClick={submit}>
            다음
          </Button>
        </div>
      </div>
    </Panel>
  );
};

export default RegisterInfoPanel;
