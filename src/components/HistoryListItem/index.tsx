import Icon from "@enact/sandstone/Icon";
import Style from "./HistoryListItem.module.css";
import styled from "styled-components";
import useNavigate from "../../hooks/useNavigate";
import path from "../../path.json";

interface HistoryListItemProps {
  id: string;
  nickname: string;
  modified: string;
  img: string;
}

const StyledProfileImage = styled.div<{ imageSrc: string }>`
  display: flex;
  flex: 3;
  background-color: #ffffff;
  border-radius: 50px 50px 0 0;
  background-image: url(${(props) => props.imageSrc});
  background-size: cover;
`;

const HistoryListItem = ({ id, nickname, modified, img }: HistoryListItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={Style.wrapper}
      onClick={() => {
        navigate(path.history.view, {
          id: id,
        });
      }}
    >
      <StyledProfileImage imageSrc={img} />
      <div className={Style.bottom}>
        <div className={Style.labelWrapper}>
          <span className={Style.text}>{nickname}</span>
          <span className={`${Style.modified} ${Style.text}`}>최근촬영: {modified}</span>
        </div>
        <Icon className={Style.icon} onClick={() => console.error("not implemented yet")}>
          verticalellipsis
        </Icon>
      </div>
    </div>
  );
};

export default HistoryListItem;
