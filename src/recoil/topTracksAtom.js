import { atom } from "recoil";

export const topTracksAtom = atom({
  key: "topTracksAtom",
  default: {
    tracks: null,
    images: null,
  },
});
