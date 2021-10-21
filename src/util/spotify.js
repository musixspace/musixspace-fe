const authEndpoint = process.env.REACT_APP_AUTH_ENDPOINT;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const clientId = process.env.REACT_APP_CLIENT_ID;

const scopes = [
  "streaming",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
  "playlist-read-private",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-top-read",
  "user-read-currently-playing",
  "user-read-private",
  "user-read-email",
  "user-library-modify",
  "user-library-read",
  "user-follow-modify",
  "user-follow-read",
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}`;
