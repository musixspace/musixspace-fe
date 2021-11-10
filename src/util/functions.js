export const paddedNumbers = (num) => {
  if (num < 10) return `0${num}`;
  return `${num}`;
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
      navigator.mediaSession.setActionHandler(action, handler);
    } catch (error) {
      console.log(`The media action ${action} is not supported yet!`);
    }
  }
};
