const authEndpoint = process.env.REACT_APP_AUTH_ENDPOINT;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const clientId = process.env.REACT_APP_CLIENT_ID;

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-top-read",
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}`;
