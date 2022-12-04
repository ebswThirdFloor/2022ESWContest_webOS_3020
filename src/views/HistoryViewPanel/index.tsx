import { Panel } from "@enact/sandstone/Panels";
import { VideoPlayerBase } from "@enact/sandstone/VideoPlayer";
import { useNavigate, useParams } from "react-router-dom";
import Style from "./HistoryViewPanel.module.css";

const HistoryViewPanel = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userInfo = JSON.parse(params.userInfo);

  return (
    <Panel css={Style}>
      <VideoPlayerBase loop autoPlay muted source={<source src={userInfo.output} />} onBack={() => navigate(-1)} />
    </Panel>
  );
};

export default HistoryViewPanel;
