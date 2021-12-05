export const paddedNumbers = (num) => {
  if (num < 10) return `0${num}`;
  return `${num}`;
};

export const generateRandomString = (length) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const setMediaSession = (
  name,
  artist,
  image,
  handlePrevPlay,
  handleNextPlay
) => {
  navigator.mediaSession.metadata = new window.MediaMetadata({
    title: name,
    artist: artist,
    artwork: [{ src: image, sizes: "640x640", type: "image/jpg" }],
  });

  const actionHandlers = [
    ["previoustrack", handlePrevPlay],
    ["nexttrack", handleNextPlay],
  ];

  for (const [action, handler] of actionHandlers) {
    try {
      if (handler) {
        navigator.mediaSession.setActionHandler(action, handler);
      }
      navigator.mediaSession.setActionHandler("play", () => {
        console.log("hello");
        navigator.mediaSession.playbackState = "paused";
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        navigator.mediaSession.playbackState = "playing";
      });
    } catch (error) {
      console.log(`The media action ${action} is not supported yet!`);
    }
  }
};
