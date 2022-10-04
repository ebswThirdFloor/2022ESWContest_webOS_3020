import Button from "@enact/sandstone/Button";
import { Header, Panel } from "@enact/sandstone/Panels";
import { useRecoilState } from "recoil";
import { pathState } from "../store";

const MainPanel = () => {
  const [_, setPath] = useRecoilState(pathState);
  return (
    <Panel>
      <Header title="Hello world!" />
      <Button
        onClick={() => {
          setPath("sub");
        }}
      >
        Click me
      </Button>
    </Panel>
  );
};

export default MainPanel;
