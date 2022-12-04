import { Panel } from "@enact/sandstone/Panels";
import Card from "../../components/Card";
import Style from "./MainPanel.module.css";
import path from "../../path.json";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import demo from "../../luna_apis/demo";

const MainPanel = () => {
  const navigate = useNavigate();
  return (
    <Panel>
      <Header title="Growth Diary" subtitle="Our family's growth diary" noBackButton />
      <Card margin="50px 150px !important" flex_direction="row"></Card>
      <div className={`${Style.row} ${Style.wrapper}`}>
        <div className={`${Style.col} ${Style.description}`}>
          <h1>Age StyleGAN for High Resolution Facial Age Transformation</h1>
          <article className={Style.row}>설명설명설명</article>
        </div>
        <div className={`${Style.col} ${Style.buttonWrapper}`}>
          <Card onClick={() => navigate(path.history.list)}>
            <h1>기록 보기</h1>
          </Card>
          <Card onClick={() => navigate(path.register.info)}>
            <h1>사용자 등록</h1>
          </Card>
          <Card onClick={() => demo()}>
            <h1>기능체험</h1>
          </Card>
          <Card onClick={() => navigate(path.setting)}>
            <h1>설정</h1>
          </Card>
        </div>
      </div>
    </Panel>
  );
};

export default MainPanel;
