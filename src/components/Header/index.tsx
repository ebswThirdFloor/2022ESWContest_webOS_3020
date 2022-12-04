import React from "react";
import { Header as _Header } from "@enact/sandstone/Panels";
import HeaderStyle from "./Header.module.css";
import Button from "@enact/sandstone/Button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  noBackButton?: boolean;
  onBackPressed?: () => void;
}

const Header = ({ title, subtitle, noBackButton = false, onBackPressed }: HeaderProps) => {
  return (
    <_Header
      title={title}
      subtitle={subtitle}
      css={HeaderStyle}
      slotAfter={!noBackButton && <Button size={"large"} icon={"arrowhookleft"} iconPosition={"after"} onClick={onBackPressed}></Button>}
      noBackButton={true}
      noCloseButton={true}
    />
  );
};

export default Header;
