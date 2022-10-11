import { Header, Panel } from "@enact/sandstone/Panels";
import { VirtualGridList } from "@enact/sandstone/VirtualList";
import HistoryListItem from "../../components/HistoryListItem";
import { VirtualGridListItemRendererProps } from "../../../types/types";
import useNavigate from "../../hooks/useNavigate";
import path from "../../path.json";

const HistoryListPanel = () => {
  const navigate = useNavigate();
  const userList = [
    {
      id: "bradpitt",
      nickname: "홍길동",
      modified: "2022.10.11",
      img: "https://image.cine21.com/resize/cine21/person/2019/0520/11_27_25__5ce2108d9e6cd[X252,310].jpg",
    },
  ];
  return (
    <Panel>
      <Header title="기록 보기" onClose={() => navigate(path.main)} />
      <VirtualGridList
        itemSize={{
          minWidth: 450,
          minHeight: 600,
        }}
        itemRenderer={(props: VirtualGridListItemRendererProps) => <HistoryListItem {...userList[props.index]} />}
        dataSize={userList.length}
      />
    </Panel>
  );
};

export default HistoryListPanel;
