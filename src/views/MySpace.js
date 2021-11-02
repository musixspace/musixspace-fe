import React, { useEffect, useState } from "react";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { useRecoilState, useSetRecoilState } from "recoil";
import image3 from "../assets/images/artists/image3.png";
import image5 from "../assets/images/artists/image5.png";
import WebPlayer from "../components/WebPlayer";
import { loadingAtom } from "../recoil/loadingAtom";
import { topArtistsAtom, topArtistsLongAtom } from "../recoil/topArtistsAtom";
import { topTracksLongAtom } from "../recoil/topTracksAtom";
import { axiosInstance } from "../util/axiosConfig";

const user = {
  name: "Amaya Srivastava",
  matches: 12,
  img: image3,
  traits: ["introvert", "easy going"],
  handle: "thehopelessromantic",
  anthem: {
    title: "Nikamma",
    album: "Lifafa",
    img: image5,
  },
};

const MySpace = () => {
  const [topTracks, setTopTracks] = useRecoilState(topTracksLongAtom);
  const [topArtists, setTopArtists] = useRecoilState(topArtistsLongAtom);
  const [currentSong, setCurrentSong] = useState({
    songId: null,
    audioUrl: null,
  });
  const setLoading = useSetRecoilState(loadingAtom);

  useEffect(() => {
    if (!topTracks.tracks) {
      setLoading(true);

      axiosInstance
        .post("/toptracks_long")
        .then((res) => {
          if (res.status === 200) {
            const songs = res.data.songs;
            let imgArr = [];
            songs.forEach((item) => {
              imgArr.push({ id: item.song_id, url: item.image_url });
            });
            setTopTracks({
              tracks: songs,
              images: imgArr,
            });
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (!topArtists.artists) {
      setLoading(true);
      axiosInstance
        .post("/topartists_long")
        .then((res) => {
          if (res.status === 200) {
            const artists = res.data.artists;
            let imgArr = [];
            artists.forEach((artist) => {
              imgArr.push({
                id: artist.artist_id,
                url:
                  artist.image_url ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd-y-IJN8glQlf1qoU01dEgGPUa0d1-sjfWg&usqp=CAU",
              });
            });

            setTopArtists({
              artists: artists,
              images: imgArr,
            });
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const onLeftClicked = (selector) => {
    document.querySelector(selector).scrollBy(-1000, 0);
  };

  const onRightClicked = (selector) => {
    document.querySelector(selector).scrollBy(1000, 0);
  };

  const handlePlaySong = (songId, audioUrl) => {
    if (audioUrl) {
      setCurrentSong({ songId, audioUrl });
    }
  };

  const handlePlayArtist = (artist) => {
    let artistId = artist.artist_id,
      audioUrl = null;
    for (let i = 0; i < artist.user_songs.length; i++) {
      if (artist.user_songs[i].preview_url) {
        audioUrl = artist.user_songs[i].preview_url;
        break;
      }
    }
    if (audioUrl) {
      setCurrentSong({ songId: artistId, audioUrl });
    }
  };

  return (
    <div className="mySpace">
      <div className="intro">
        <div className="image-container">
          <img src={user.img} alt={`${user.name}'s Image'`} />
        </div>
        <div className="content-container">
          <div className="main">
            <p>{user.name}</p>
            <div className="sub">
              <span>{user.matches} matches</span>
              <div className="traits-container">
                {user.traits.map((trait) => (
                  <div key={trait} className="trait">
                    {trait}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="middle">
            <p>{user.handle}</p>
            <div className="button-container">
              <button>Match</button>
            </div>
          </div>
          <div className="anthem-container">
            <div className="content">
              <div>{`${user.name.trim().split(" ")[0]}'s Anthem`}</div>
              <p>{user.anthem.title}</p>
              <p>{user.anthem.album}</p>
            </div>
            <div className="image-container">
              <img
                src={user.anthem.img}
                alt={`${user.name.trim().split(" ")[0]}'s Anthem'`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="topTracks">
        <div className="upper-container">
          <div className="title">Top Tracks</div>
        </div>
        <div className="songs-container">
          <button
            className="prev"
            onClick={() =>
              onLeftClicked(".topTracks > .songs-container > .tracks-container")
            }
          >
            <FiSkipBack />
          </button>
          <div className="tracks-container">
            {topTracks.tracks &&
              topTracks.tracks.map((item) => (
                <div key={item.song_id} className="track">
                  <div
                    className={`image-container ${
                      item.song_id === currentSong.songId ? "selected" : ""
                    }`}
                  >
                    <img src={item.image_url} alt={item.name} />
                  </div>
                  <div className="content-container">
                    <div className="title">{item.name}</div>
                    <div className="sub">
                      {item.song_artists.map((i) => i.name).join(",")}
                    </div>
                  </div>
                  {item.preview_url && (
                    <button
                      className="controls"
                      onClick={() =>
                        handlePlaySong(item.song_id, item.preview_url)
                      }
                    >
                      {item.song_id === currentSong.songId ? (
                        <AiOutlinePause />
                      ) : (
                        <AiFillCaretRight />
                      )}
                    </button>
                  )}
                </div>
              ))}
          </div>
          <button
            className="next"
            onClick={() =>
              onRightClicked(
                ".topTracks > .songs-container > .tracks-container"
              )
            }
          >
            <FiSkipForward />
          </button>
        </div>
      </div>
      <div className="topArtists">
        <div className="upper-container">
          <div className="title">Top Artists</div>
        </div>
        <div className="songs-container">
          <button
            className="prev"
            onClick={() =>
              onLeftClicked(
                ".topArtists > .songs-container > .tracks-container"
              )
            }
          >
            <FiSkipBack />
          </button>
          <div className="tracks-container">
            {topArtists.artists &&
              topArtists.artists.map((item) => (
                <div key={item.artist_id} className="track">
                  <div
                    className={`image-container ${
                      item.artist_id === currentSong.songId ? "selected" : ""
                    }`}
                  >
                    <img src={item.image_url} alt={item.name} />
                  </div>
                  <div className="content-container">
                    <div className="title">{item.name}</div>
                  </div>
                  <button
                    className="controls"
                    onClick={() => handlePlayArtist(item)}
                  >
                    {item.artist_id === currentSong.songId ? (
                      <AiOutlinePause />
                    ) : (
                      <AiFillCaretRight />
                    )}
                  </button>
                </div>
              ))}
          </div>
          <button
            className="next"
            onClick={() =>
              onRightClicked(
                ".topArtists > .songs-container > .tracks-container"
              )
            }
          >
            <FiSkipForward />
          </button>
        </div>
      </div>
      <WebPlayer
        url={currentSong.audioUrl}
        nextPlay={() => setCurrentSong({ songId: null, audioUrl: null })}
        noControls={true}
      />
    </div>
  );
};

export default MySpace;
