import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useParams } from "react-router";
import logo from "../assets/images/logo-black.png";
import { axiosInstance } from "../util/axiosConfig";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import WebPlayer from "../components/WebPlayer";
import { setMediaSession } from "../util/functions";

const Match = () => {
  const { matchHandle } = useParams();

  const [store, setStore] = useState({
    me: null,
    friend: null,
    commonTracks: null,
    commonArtists: null,
    commonRecents: null,
    compatibility: null,
    topArtist: null,
    topTrack: null,
  });

  const [audioUrl, setAudioUrl] = useState("");

  const scrollToPage = (str) => {
    document.querySelector(`.${str}`).scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (matchHandle) {
      axiosInstance
        .get(`/match/${matchHandle}`, { timeout: 10000 })
        .then((res) => {
          console.log(res.data);
          setStore({
            me: res.data.currentUser,
            friend: res.data.matchedUser,
            commonTracks: res.data.commonTracks,
            commonArtists: res.data.commonArtists,
            commonRecents: res.data.commonRecents,
            compatibility: res.data.compatibility,
            topTrack:
              res.data.commonTracks.length > 0
                ? res.data.commonTracks[0]
                : null,
            topArtist:
              res.data.commonArtists.length > 0
                ? res.data.commonArtists[0]
                : null,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [matchHandle]);

  const toggleAudioUrl = (name, artist, image, url) => {
    if (url === audioUrl) {
      setAudioUrl("");
    } else {
      setAudioUrl(url);
      setMediaSession(name, artist, image, null, null);
    }
  };

  return (
    <div className="match-container">
      <div className="first-page">
        <div className="topbar">
          <div className="image-container">
            <img
              src={(store.me && store.me.image_url) || logo}
              alt={store.me && store.me.name}
            />
            <img
              src={(store.friend && store.friend.image_url) || logo}
              alt={store.friend && store.friend.name}
            />
          </div>
          <p className="name-container">
            {`${store.me && store.me.name.split(" ")[0]}`} x{" "}
            {`${store.friend && store.friend.name.split(" ")[0]}`}
          </p>
        </div>
        <div className="middle-content">
          <div className="text">
            <p>
              That’s a harmony we have never heard of before! Send a song to
              give a spark to this vibe.
            </p>
          </div>
          <div className="button-container">
            <button>Send a Song</button>
          </div>
        </div>
        <div className="percentage">
          <p>~{store.compatibility && store.compatibility.toFixed(0)}%~</p>
        </div>
        <div
          className="scroll-content"
          onClick={() => scrollToPage("second-page")}
        >
          <p>
            all it takes is a <span className="black">scroll up</span> to know
            what{" "}
            <span className="black">{`${
              store.me && store.me.name.split(" ")[0]
            }`}</span>{" "}
            and{" "}
            <span className="black">{`${
              store.friend && store.friend.name.split(" ")[0]
            }`}</span>
            <br />
            like to
            <span className="black"> listen</span> to and imagine the{" "}
            <span className="black">picturesque</span> of{" "}
            {`${store.me && store.me.name.split(" ")[0]}`} x{" "}
            {`${store.friend && store.friend.name.split(" ")[0]}`}.
          </p>
          <FiChevronDown />
        </div>
      </div>
      <div className="second-page">
        <div className="content-container">
          <div className="title">Top Artist</div>
          <div className="image-container">
            <img
              src={(store.topArtist && store.topArtist.image_url) || logo}
              alt={store.topArtist && store.topArtist.name}
            />
            {store.topArtist && store.topArtist.topTrack.preview_url && (
              <button
                className="control"
                onClick={() =>
                  toggleAudioUrl(
                    store.topArtist.topTrack.name,
                    null,
                    store.topArtist.image_url,
                    store.topArtist.topTrack.preview_url
                  )
                }
              >
                {audioUrl === store.topArtist.topTrack.preview_url ? (
                  <AiOutlinePause />
                ) : (
                  <AiFillCaretRight />
                )}
              </button>
            )}
          </div>
          <div className="name">
            {(store.topArtist && store.topArtist.name) || "No Artist"}
          </div>
        </div>
        <div className="middle-content">
          <p>
            <span className="black">when it comes to these,</span>
            <br />
            {`${store.me && store.me.name.split(" ")[0]}`} and{" "}
            {`${store.friend && store.friend.name.split(" ")[0]}`}{" "}
            <span className="black">can’t hit the skip button!</span>
          </p>
        </div>
        <div className="content-container">
          <div className="title">Top Track</div>
          <div className="image-container">
            <img
              src={(store.topTrack && store.topTrack.image_url) || logo}
              alt={store.topTrack && store.topTrack.name}
            />
            {store.topTrack && store.topTrack.preview_url && (
              <button
                className="control"
                onClick={() =>
                  toggleAudioUrl(
                    store.topTrack.name,
                    store.topTrack.artist.map((item) => item.name).join(" "),
                    store.topTrack.image_url,
                    store.topTrack.preview_url
                  )
                }
              >
                {audioUrl === store.topTrack.preview_url ? (
                  <AiOutlinePause />
                ) : (
                  <AiFillCaretRight />
                )}
              </button>
            )}
          </div>
          <div className="name">
            {(store.topTrack && store.topTrack.name) || "No Track"}
          </div>
        </div>
        <div className="scroll-content">
          <p>
            wait<span className="black"> there's more, </span>
            dig into more!
          </p>
          <FiChevronDown />
        </div>
      </div>
      {audioUrl && (
        <WebPlayer
          url={audioUrl}
          nextPlay={() => setAudioUrl("")}
          noControls={true}
        />
      )}
    </div>
  );
};

export default Match;
