import { atom } from "recoil";

export interface pathStoreType {
  path: string[] | string;
  param?:
    | null
    | {
        nickname: string;
        age: number;
        gender: number;
      }
    | {
        id: string;
      };
}

const pathStore = atom({
  key: "pathState",

  default: {
    path: "main",
    param: null,
  } as pathStoreType,
});

export default pathStore;
