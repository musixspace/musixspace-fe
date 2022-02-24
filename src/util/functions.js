import jwt_decode from "jwt-decode";
import moment from "moment";

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

export const nFormatter = (num, digits = 1) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};

export const rgbToHex = (r, g, b) =>
  "#" +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");

export const getContrastYIQ = (hexcolor) => {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};

export const copyToClipboard = (textToCopy) => {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // text area method
    let textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      // here the magic happens
      document.execCommand("copy") ? res() : rej();
      textArea.remove();
    });
  }
};

export const getFormattedTime = (date) => {
  const today = moment();
  const yesterday = today.clone().subtract(1, "days").startOf("day");
  if (moment(today).isSame(date, "D")) {
    return moment(date).format("LT");
  } else if (moment(yesterday).isSame(date, "D")) {
    return "yesterday";
  }
  return moment(date).format("DD/MM/YY");
};
