import { atom } from "recoil";

export const surpriseTracksAtom = atom({
  key: "surpriseTracksAtom",
  default: {
    tracks: null,
    images: null,
  },
});
