import { atom, selector } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    displayName: null,
    image: null,
    username: null,
    traits: [],
    anthem: null,
    topTracksLong: {
      tracks: null,
      images: null,
    },
    topTracksMedium: {
      tracks: null,
      images: null,
    },
    topTracksShort: {
      tracks: null,
      images: null,
    },
    topArtistsLong: {
      artists: null,
      images: null,
    },
    topArtistsMedium: {
      artists: null,
      images: null,
    },
    topArtistsShort: {
      artists: null,
      images: null,
    },
    surpriseTracks: {
      tracks: null,
      images: null,
    },
    moodRadio: null,
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

export const discoverNumber = atom({
  key: "discoverNumberAtom",
  default: 0,
});
