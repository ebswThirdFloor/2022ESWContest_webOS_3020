import React from "react";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import MainPanel from "../views/MainPanel";
import RegisterInfoPanel from "../views/RegisterInfoPanel";
import RegisterPhotoPanel from "../views/RegisterPhotoPanel";
import HistoryListPanel from "../views/HistoryListPanel";
import HistoryViewPanel from "../views/HistoryViewPanel";
import SettingPanel from "../views/SettingPanel";
import Style from "./App.module.css";
import path from "../path.json";

import { MemoryRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <video autoPlay muted loop className={Style.video}>
        <source src={require("../assets/background.mp4")} />
      </video>
      <MemoryRouter>
        <Routes>
          <Route path={path.main} element={<MainPanel />} />
          <Route path={path.register.info} element={<RegisterInfoPanel />} />
          <Route path={path.register.info + ":userInfo"} element={<RegisterInfoPanel />} />
          <Route path={path.register.photo + ":userInfo"} element={<RegisterPhotoPanel />} />
          <Route path={path.history.list} element={<HistoryListPanel />} />
          <Route path={path.history.view + ":userInfo"} element={<HistoryViewPanel />} />
          <Route path={path.setting} element={<SettingPanel />} />
        </Routes>
      </MemoryRouter>
    </>
  );
};

export default ThemeDecorator(App);
