import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const QUERY_KEY = "USER_LIST";

const fetcher = async () => {
  const config = {
    method: "get",
    url: `http://165.246.44.130:3000/user`,
  };
  const res = await axios(config);
  return res.data;
};

const useUserListQuery = () => {
  return useQuery([QUERY_KEY], () => fetcher());
};

export default useUserListQuery;
