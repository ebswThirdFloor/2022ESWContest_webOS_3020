import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "USER_LIST";

const fetcher = async () => {
  // TODO: 서버연동
  const res = [
    {
      id: "bradpitt",
      nickname: "홍길동",
      modified: "2022.10.11",
      img: "https://image.cine21.com/resize/cine21/person/2019/0520/11_27_25__5ce2108d9e6cd[X252,310].jpg",
    },
  ];
  return res;
};

const useUserListQuery = () => {
  return useQuery([QUERY_KEY], () => fetcher());
};

export default useUserListQuery;
