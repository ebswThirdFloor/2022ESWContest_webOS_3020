import React, { useEffect } from "react";
import Panels from "@enact/sandstone/Panels";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Outlet } from "react-router-dom";
import MainPanel from "../views/MainPanel";
import RegisterInfoPanel from "../views/RegisterInfoPanel/";
import RegisterPhotoPanel from "../views/RegisterPhotoPanel/";
import HistoryListPanel from "../views/HistoryListPanel";
import Style from "./App.module.css";

import { useLocation, useNavigate } from "react-router-dom";

const ErrorElement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    console.error("404");
    navigate("/");
  }, []);
  return <div>current location: {location.pathname}</div>;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <Panels className={Style.mainPanel}>
          <Outlet />
        </Panels>
      }
      errorElement={<ErrorElement />}
    >
      <Route path="/" element={<MainPanel />} />
      <Route path="register">
        <Route path="info" element={<RegisterInfoPanel />} />
        <Route path="photo/:nickname/:age/:gender" element={<RegisterPhotoPanel />} />
      </Route>
      <Route path="history">
        <Route path="list" element={<HistoryListPanel />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default ThemeDecorator(App);
