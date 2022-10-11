import { Header, Panel } from "@enact/sandstone/Panels";
import VideoPlayer from "@enact/sandstone/VideoPlayer";
import useNavigate from "../../hooks/useNavigate";
import useParams from "../../hooks/useParams";
import path from "../../path.json";

const HistoryViewPanel = () => {
  const navigate = useNavigate();
  const userInfo = useParams();

  const userData = {
    ...userInfo,
    userName: "bradpitt",
    src: "http://43.201.82.61:3000/video/webos.mp4",
  };

  console.log(userData);

  return (
    <Panel>
      <Header title={`${userData.userName}님의 기록`} onClose={() => navigate(path.main)} />
      <VideoPlayer loop autoPlay>
        <source src={userData.src} />
      </VideoPlayer>
    </Panel>
  );
};

export default HistoryViewPanel;
