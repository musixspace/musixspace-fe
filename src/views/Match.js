import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useParams } from "react-router";
import logo from "../assets/images/logo-black.png";
import { axiosInstance } from "../util/axiosConfig";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import WebPlayer from "../components/WebPlayer";
import { setMediaSession } from "../util/functions";
import Skeleton from "../components/Skeleton";
import CustomHelmet from "../components/CustomHelmet";

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
    <>
      <CustomHelmet
        title="Match"
        description="Check your music compatibility with others"
        keywords="Match, Common Songs, Common Artists, Common Genres"
      />
      <div className="match-container">
        <div className="first-page">
          <div className="topbar">
            <div className="image-container">
              {!store.me ? (
                <>
                  <Skeleton type="circle" />
                  <Skeleton type="circle" />
                </>
              ) : (
                <>
                  <img
                    src={(store.me && store.me.image_url) || logo}
                    alt={store.me && store.me.name}
                  />
                  <img
                    src={(store.friend && store.friend.image_url) || logo}
                    alt={store.friend && store.friend.name}
                  />
                </>
              )}
            </div>
            <p className="name-container">
              {!store.me && !store.friend ? (
                <Skeleton type="text" />
              ) : (
                <>
                  {`${store.me && store.me.name.split(" ")[0]}`} x{" "}
                  {`${store.friend && store.friend.name.split(" ")[0]}`}
                </>
              )}
            </p>
          </div>
          <div className="middle-content">
            {!store.me ? (
              <>
                <Skeleton type="text" />
              </>
            ) : (
              <>
                <div className="text">
                  <p>
                    That’s a harmony we have never heard of before! Send a song
                    to give a spark to this vibe.
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="percentage">
            {!store.me ? (
              <Skeleton type="text" />
            ) : (
              <p>~{store.compatibility && store.compatibility.toFixed(0)}%~</p>
            )}
          </div>
          {store.me && (
            <div
              className="scroll-content"
              onClick={() => scrollToPage("second-page")}
            >
              <p>
                all it takes is a <span className="black">scroll up</span> to
                know what{" "}
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
          )}
        </div>
        {store?.commonArtists?.length > 0 && (
          <div className="second-page">
            <div className="main-content">
              <p>{store.commonArtists.length}</p>
              <p>Common Artists</p>
            </div>
            <div className="artist-list">
              {store.commonArtists.map((item) => (
                <div key={item.name} className="common-artist">
                  <div className="image-container">
                    <img src={item.image_url || logo} alt={item.name} />
                  </div>
                  <div className="controls">
                    <button
                      onClick={() =>
                        toggleAudioUrl(
                          item.topTrack.name,
                          item.name,
                          item.image_url,
                          item.topTrack.preview_url
                        )
                      }
                    >
                      {audioUrl === item.topTrack.preview_url ? (
                        <AiOutlinePause />
                      ) : (
                        <AiFillCaretRight />
                      )}
                    </button>
                  </div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {store?.commonTracks?.length > 0 && (
          <div className="second-page">
            <div className="main-content">
              <p>{store.commonTracks.length}</p>
              <p>Common Tracks</p>
            </div>
            <div className="artist-list">
              {store.commonTracks.map((item) => (
                <div key={item.name} className="common-artist common-track">
                  <div className="image-container">
                    <img src={item.image_url || logo} alt={item.name} />
                  </div>
                  <div className="controls">
                    <button
                      onClick={() =>
                        toggleAudioUrl(
                          item.name,
                          item.artist.map((i) => i.name).join(", "),
                          item.image_url,
                          item.preview_url
                        )
                      }
                    >
                      {audioUrl === item.preview_url ? (
                        <AiOutlinePause />
                      ) : (
                        <AiFillCaretRight />
                      )}
                    </button>
                  </div>
                  <div className="track-meta">
                    <p>{item.name}</p>
                    <p>{item.artist.map((i) => i.name).join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {audioUrl && (
          <WebPlayer
            url={audioUrl}
            nextPlay={() => setAudioUrl("")}
            noControls={true}
          />
        )}
      </div>
    </>
  );
};

export default Match;
