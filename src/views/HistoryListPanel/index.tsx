import { Header, Panel } from "@enact/sandstone/Panels";
import { VirtualGridList } from "@enact/sandstone/VirtualList";
import { useNavigate } from "react-router-dom";
import HistoryListItem from "../../components/HistoryListItem";
import { VirtualGridListItemRendererProps } from "../../../types/types";

const HistoryListPanel = () => {
  const navigate = useNavigate();
  return (
    <Panel>
      <Header title="기록 보기" onClose={() => navigate("/")} />
      <VirtualGridList
        itemSize={{
          minWidth: 450,
          minHeight: 600,
        }}
        itemRenderer={(props: VirtualGridListItemRendererProps) => (
          <HistoryListItem
            id="bradpitt"
            nickname="홍길동"
            modified="2022.10.11"
            img="https://image.cine21.com/resize/cine21/person/2019/0520/11_27_25__5ce2108d9e6cd[X252,310].jpg"
          />
        )}
        dataSize={5}
      />
    </Panel>
  );
};

export default HistoryListPanel;
