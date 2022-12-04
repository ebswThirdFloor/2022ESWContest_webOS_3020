import Icon from "@enact/sandstone/Icon";
import Style from "./HistoryListItem.module.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import path from "../../path.json";
import sendNotification from "../../luna_apis/sendNotification";

interface HistoryListItemProps {
  userInfo: {
    userID: string;
    nickname: string;
    age: number;
    gender: number;
    modified: number;
  };
  userProfile: string;
  output?: string;
}

const StyledProfileImage = styled.div<{ imageSrc: string }>`
  display: flex;
  flex: 3;
  background-color: #ffffff;
  border-radius: 15px 15px 0 0;
  background-image: url(${(props) => props.imageSrc});
  background-size: cover;
`;

const HistoryListItem = ({ userInfo, userProfile, output }: HistoryListItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={Style.wrapper}
      onClick={() => {
        if (output) {
          navigate(path.history.view + encodeURIComponent(JSON.stringify({ userInfo, output })));
        } else {
          sendNotification("성장일기가 아직 생성되지 않았습니다.");
        }
      }}
    >
      <StyledProfileImage imageSrc={userProfile} />
      <div className={Style.bottom}>
        <div className={Style.labelWrapper}>
          <span className={Style.text}>{userInfo.nickname}</span>
          <span className={`${Style.modified} ${Style.text}`}>최근촬영: {new Date(userInfo.modified).toISOString().slice(0, 10)}</span>
        </div>
        <Icon className={Style.icon} onClick={() => console.error("not implemented yet")}>
          verticalellipsis
        </Icon>
      </div>
    </div>
  );
};

export default HistoryListItem;
