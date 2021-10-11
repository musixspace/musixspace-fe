export const themeSwitch = (str) => {
  switch (str) {
    case "/top-tracks":
      return "var(--bg-top-tracks)";
    case "/insights":
      return "var(--bg-insights)";
    default:
      return "var(--bg-home)";
  }
};
