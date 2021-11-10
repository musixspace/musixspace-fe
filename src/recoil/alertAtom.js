import { atom } from "recoil";

export const alertAtom = atom({
  key: "alertAtom",
  default: {
    open: false,
    message: "",
    type: "success",
  },
});
