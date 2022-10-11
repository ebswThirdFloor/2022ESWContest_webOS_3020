import { Header, Panel } from "@enact/sandstone/Panels";
import VideoPlayer, { Video } from "@enact/sandstone/VideoPlayer";
import { useNavigate, useMatch } from "react-router-dom";

interface HistoryViewPanelProps {
  id: string;
  nickname: string;
}

const HistoryViewPanel = () => {
  const navigate = useNavigate();
  const userInfo = useMatch("/history/view/:id");

  const userData = {
    ...userInfo?.params,
    userName: "bradpitt",
    src: "http://43.201.82.61:3000/video/webos.mp4",
  };

  console.log(userData);

  return (
    <Panel>
      <Header title={`${userData.userName}님의 기록`} onClose={() => navigate("/")} />
      <VideoPlayer loop autoPlay>
        <source src={userData.src} />
      </VideoPlayer>
    </Panel>
  );
};

export default HistoryViewPanel;
