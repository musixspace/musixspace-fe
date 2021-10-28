import { atom } from "recoil";

export const topArtistsAtom = atom({
  key: "topArtistsAtom",
  default: {
    artists: null,
    images: null,
  },
});
