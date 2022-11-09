import React from "react";
import Panels from "@enact/sandstone/Panels";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import Routable, { Route } from "@enact/ui/Routable";
import MainPanel from "../views/MainPanel";
import RegisterInfoPanel from "../views/RegisterInfoPanel/";
import RegisterPhotoPanel from "../views/RegisterPhotoPanel/";
import HistoryListPanel from "../views/HistoryListPanel";
import HistoryViewPanel from "../views/HistoryViewPanel";
import SettingPanel from "../views/SettingPanel";
import Style from "./App.module.css";
import { useRecoilValue } from "recoil";
import pathStore from "../store/pathStore";
import path from "../path.json";

const Views = Routable({ navigate: "onNavigate" }, ({ children }: { children: React.ReactNode }) => <Panels className={Style.mainPanel}>{children}</Panels>);

const App = () => {
  const pathState = useRecoilValue(pathStore);
  return (
    <Views path={pathState.path}>
      <Route path={path.main} component={MainPanel} />
      <Route path={path.register.info} component={RegisterInfoPanel} />
      <Route path={path.register.photo} component={RegisterPhotoPanel} />
      <Route path={path.history.list} component={HistoryListPanel} />
      <Route path={path.history.view} component={HistoryViewPanel} />
      <Route path={path.setting} component={SettingPanel} />
    </Views>
  );
};

export default ThemeDecorator(App);
