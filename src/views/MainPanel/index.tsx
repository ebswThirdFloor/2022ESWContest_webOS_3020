import { Header, Panel } from "@enact/sandstone/Panels";
import { useRecoilState } from "recoil";
import Card from "../../components/Card";
import { pathState } from "../../store";
import Style from "./MainPanel.module.css";

const MainPanel = () => {
  const [_, setPath] = useRecoilState(pathState);
  return (
    <Panel>
      <Header title="성장 일기" noSubtitle />
      <div className={`${Style.row} ${Style.btnWrapper}`}>
        <div className={Style.col}>
          <Card bgcolor="#2A3A64" color="#ffffff" onClick={() => console.log("nav to history")}>
            <h1>기록 보기</h1>
          </Card>
        </div>
        <div className={Style.col}>
          <Card bgcolor="#2A3A64" color="#ffffff" onClick={() => setPath("registerInfo")}>
            <h1>사용자 등록</h1>
          </Card>
          <Card bgcolor="#2A3A64" color="#ffffff" onClick={() => console.log("nav to setting")}>
            <h1>설정</h1>
          </Card>
        </div>
      </div>
    </Panel>
  );
};

export default MainPanel;
