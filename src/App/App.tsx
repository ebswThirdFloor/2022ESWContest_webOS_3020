import React from "react";
import Panels from "@enact/sandstone/Panels";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import Routable, { Route } from "@enact/ui/Routable";
import { useRecoilValue } from "recoil";
import MainPanel from "../views/MainPanel";
import SubPanel from "../views/SubPanel";
import { pathState } from "../store";
import Style from "./App.module.css";

const App = () => {
  const path = useRecoilValue(pathState);

  const MainNavigator = Routable({ navigate: "mainNavigate" }, ({ children }: { children: React.ReactNode }) => (
    <Panels className={Style.mainPanel}>{children}</Panels>
  ));

  return (
    <MainNavigator path={path}>
      <Route path="main" component={MainPanel} />
      <Route path="sub" component={SubPanel} />
    </MainNavigator>
  );
};

export default ThemeDecorator(App);
