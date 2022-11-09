import { Header, Panel } from "@enact/sandstone/Panels";
import { VirtualGridList } from "@enact/sandstone/VirtualList";
import HistoryListItem from "../../components/HistoryListItem";
import { VirtualGridListItemRendererProps } from "../../../types/types";
import useNavigate from "../../hooks/useNavigate";
import path from "../../path.json";
import useUserListQuery from "../../hooks/useUserListQuery";

const HistoryListPanel = () => {
  const navigate = useNavigate();
  const userList = useUserListQuery();
  console.log("userList: ", userList);
  return (
    <Panel>
      <Header title="기록 보기" onClose={() => navigate(path.main)} />
      {userList.isLoading ? (
        <span>Loading...</span>
      ) : userList.isError ? (
        <span>Error!</span>
      ) : userList.data ? (
        <VirtualGridList
          itemSize={{
            minWidth: 450,
            minHeight: 600,
          }}
          itemRenderer={(props: VirtualGridListItemRendererProps) => <HistoryListItem {...userList.data![props.index]} />}
          dataSize={userList.data!.length}
        />
      ) : null}
    </Panel>
  );
};

export default HistoryListPanel;
