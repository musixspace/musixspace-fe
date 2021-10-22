export const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("spotifyId");
  window.location = "/";
};
