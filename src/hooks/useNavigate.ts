import { useRecoilState } from "recoil";
import pathStore, { pathStoreType } from "../store/pathStore";

const useNavigate = () => {
  const [_, setPath] = useRecoilState(pathStore);
  return (path: pathStoreType["path"], params?: pathStoreType["param"]) => {
    setPath({
      path: path,
      param: params,
    });
  };
};

export default useNavigate;
