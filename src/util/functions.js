export const handleLogout = () => {
  localStorage.removeItem("accessToken");
  window.location = "/";
};
