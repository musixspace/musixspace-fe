import { atom } from "recoil";

export const topArtistsLongAtom = atom({
  key: "topArtistsLongAtom",
  default: {
    artists: null,
    images: null,
  },
});

export const topArtistsMediumAtom = atom({
  key: "topArtistsMediumAtom",
  default: null,
});

export const topArtistsShortAtom = atom({
  key: "topArtistsShortAtom",
  default: null,
});
