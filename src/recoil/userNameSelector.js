import { selector } from "recoil";
import { userState } from "./userAtom";

export const userNameSelector = selector({
  key: "userNameSelector",
  get: ({ get }) => {
    const { username } = get(userState);
    return username.split(" ")[0];
  },
});
