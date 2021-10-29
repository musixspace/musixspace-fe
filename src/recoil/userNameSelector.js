import { selector } from "recoil";
import { userState } from "./userAtom";

export const userNameSelector = selector({
  key: "userNameSelector",
  get: ({ get }) => {
    const { displayName } = get(userState);
    if (displayName) return displayName.split(" ")[0];
    return "";
  },
});
