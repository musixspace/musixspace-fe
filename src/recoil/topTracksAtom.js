import { atom } from "recoil";

export const topTracksLongAtom = atom({
  key: "topTracksLongAtom",
  default: {
    tracks: null,
    images: null,
  },
});

export const topTracksMediumAtom = atom({
  key: "topTracksMediumAtom",
  default: null,
});

export const topTracksShortAtom = atom({
  key: "topTracksShortAtom",
  default: null,
});
