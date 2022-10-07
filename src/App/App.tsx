import React from "react";
import Panels from "@enact/sandstone/Panels";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Outlet } from "react-router-dom";
import MainPanel from "../views/MainPanel";
import RegisterInfoPanel from "../views/RegisterInfoPanel/";
import RegisterPhotoPanel from "../views/RegisterPhotoPanel/";
import Style from "./App.module.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <Panels className={Style.mainPanel}>
          <Outlet />
        </Panels>
      }
    >
      <Route path="/" element={<MainPanel />} />
      <Route path="register">
        <Route path="info" element={<RegisterInfoPanel />} />
        <Route path="photo/:nickname/:age/:gender" element={<RegisterPhotoPanel />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default ThemeDecorator(App);
