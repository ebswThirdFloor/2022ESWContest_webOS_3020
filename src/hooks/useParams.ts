import { useRecoilState } from "recoil";
import pathStore from "../store/pathStore";

const useParams = () => {
  const [path, setPath] = useRecoilState(pathStore);
  return path.param;
};

export default useParams;
