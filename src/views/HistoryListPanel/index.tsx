import { Panel } from "@enact/sandstone/Panels";
import { VirtualGridList } from "@enact/sandstone/VirtualList";
import HistoryListItem from "../../components/HistoryListItem";
import { VirtualGridListItemRendererProps } from "../../../types/types";
import useUserListQuery from "../../hooks/useUserListQuery";
import Header from "../../components/Header";
import Style from "./HistoryListPanel.module.css";
import { useNavigate } from "react-router-dom";

const HistoryListPanel = () => {
  const userList = useUserListQuery();
  const navigation = useNavigate();
  console.log(userList.data);
  return (
    <Panel>
      <Header title="My Growth Diary" onBackPressed={() => navigation(-1)} />
      <div className={Style.wrapper}>
        {userList.isLoading ? (
          <span>Loading...</span>
        ) : userList.isError ? (
          <span>Error!</span>
        ) : userList.data ? (
          <VirtualGridList
            itemSize={{
              minWidth: 450,
              minHeight: 460,
            }}
            itemRenderer={(props: VirtualGridListItemRendererProps) => <HistoryListItem {...userList.data![props.index]} />}
            dataSize={userList.data!.length}
          />
        ) : null}
      </div>
    </Panel>
  );
};

export default HistoryListPanel;
