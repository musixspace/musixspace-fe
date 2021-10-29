import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    displayName: null,
    image: null,
    username: null,
  },
});
