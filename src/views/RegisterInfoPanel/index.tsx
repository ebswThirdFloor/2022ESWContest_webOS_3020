import { useState } from "react";
import { Header, Panel } from "@enact/sandstone/Panels";
import { useNavigate } from "react-router-dom";
import Input from "@enact/sandstone/Input";
import Picker from "@enact/sandstone/Picker";
import Button from "@enact/sandstone/Button";
import Card from "../../components/Card";
import Style from "./RegisterInfoPanel.module.css";
import { InputEvent, PickerEvent } from "../../types";

const RegisterInfoPanel = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState(0);

  return (
    <Panel>
      <Header title="사용자 등록" onClose={() => navigate(-1)} />
      <div className={Style.contentWrapper}>
        <Card align_items="flex-start" justify_content="flex_start">
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
                onChange={(e) => setAge((e as unknown as InputEvent<number>).value)}
              />
            </div>
            <label>성별: </label>
            <Picker className={Style.switch} onChange={(e: PickerEvent) => setGender(e.value)}>
              {["남성", "여성"]}
            </Picker>
          </div>
          <Button
            className={Style.next}
            size={"small"}
            icon={"arrowsmallright"}
            iconPosition={"after"}
            onClick={() => navigate(`/register/photo/${nickname}/${age}/${gender}`)}
          >
            다음
          </Button>
        </Card>
      </div>
    </Panel>
  );
};

export default RegisterInfoPanel;