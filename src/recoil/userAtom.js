import { atom, selector } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    displayName: null,
    image: null,
    username: null,
    traits: [],
    anthem: null,
  },
});

export const userNameSelector = selector({
  key: "userNameSelector",
  get: ({ get }) => {
    const { displayName } = get(userState);
    if (displayName) return displayName.split(" ")[0];
    return "";
  },
});
