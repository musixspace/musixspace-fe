import React, { useEffect, useState } from "react";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import image3 from "../assets/images/artists/image3.png";
import image5 from "../assets/images/artists/image5.png";
import WebPlayer from "../components/WebPlayer";
import useTopArtists from "../hooks/useTopArtists";
import useTopTracks from "../hooks/useTopTracks";
import { topArtistsLongAtom } from "../recoil/topArtistsAtom";
import { topTracksLongAtom } from "../recoil/topTracksAtom";

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
  const { getTopTracksLong } = useTopTracks();
  const { getTopArtistsLong } = useTopArtists();
  const topTracks = useRecoilValue(topTracksLongAtom);
  const topArtists = useRecoilValue(topArtistsLongAtom);
  const [currentSong, setCurrentSong] = useState({
    songId: null,
    audioUrl: null,
    list: "topTracks",
  });

  useEffect(() => {
    if (!topTracks.tracks) {
      getTopTracksLong();
    } else if (
      topTracks.tracks.length > 0 &&
      !currentSong.songId &&
      currentSong.list === "topTracks"
    ) {
      setCurrentSong({
        ...currentSong,
        songId: topTracks.tracks[0].song_id,
        audioUrl: topTracks.tracks[0].preview_url,
      });
    }
  }, [topTracks.tracks]);

  useEffect(() => {
    if (!topArtists.artists) {
      getTopArtistsLong();
    }
  }, [topArtists.artists]);

  useEffect(() => {
    if (currentSong.songId && currentSong.list) {
      let container;
      if (currentSong.list === "topTracks") {
        container = document.querySelector(
          ".topTracks > .songs-container > .tracks-container"
        );
      } else {
        container = document.querySelector(
          ".topArtists > .songs-container > .tracks-container"
        );
      }
      console.log(container);
      let children = container.children;
      let index = 0;
      while (children[index].id !== currentSong.songId) {
        index++;
      }
      // console.log(index);
      if (index) {
        const leftOffset = container.querySelector(
          `.track:nth-child(${index + 1})`
        ).offsetLeft;
        const widthOfElement = container.querySelector(
          `.track:nth-child(${index + 1})`
        ).offsetWidth;
        container.scrollTo({
          left: leftOffset - widthOfElement / 1.5,
          behavior: "smooth",
        });
      } else {
        container.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  }, [currentSong.songId]);

  const onLeftClicked = (selector) => {
    document.querySelector(selector).scrollBy(-1000, 0);
  };

  const onRightClicked = (selector) => {
    document.querySelector(selector).scrollBy(1000, 0);
  };

  const handlePlaySong = (songId, audioUrl, list = "topTracks") => {
    setCurrentSong({ ...currentSong, songId, audioUrl, list });
  };

  const handlePlayArtist = (artist) => {
    // console.log(artist);
    handlePlaySong(artist.artist_id, artist.toptrack_url, "topArtists");
  };

  const handleNextPlay = () => {
    if (topTracks && topTracks.tracks && currentSong.list === "topTracks") {
      const track = topTracks.tracks.find(
        (item) => item.song_id === currentSong.songId
      );
      const index = topTracks.tracks.indexOf(track);
      if (index + 1 !== topTracks.tracks.length) {
        handlePlaySong(
          topTracks.tracks[index + 1].song_id,
          topTracks.tracks[index + 1].preview_url
        );
      } else {
        handlePlaySong(
          topTracks.tracks[0].song_id,
          topTracks.tracks[0].preview_url
        );
      }
    } else if (currentSong.list === "topArtists") {
      const artist = topArtists.artists.find(
        (item) => item.artist_id === currentSong.songId
      );
      const index = topArtists.artists.indexOf(artist);
      if (index + 1 !== topArtists.artists.length) {
        handlePlayArtist(topArtists.artists[index + 1]);
      } else {
        handlePlayArtist(topArtists.artists[0]);
      }
    }
  };

  const handlePause = () => {
    setCurrentSong({ songId: null, audioUrl: null, list: null });
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
                <div key={item.song_id} id={item.song_id} className="track">
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
                      {item.artists.map((i) => i.name).join(", ")}
                    </div>
                  </div>
                  {item.preview_url && (
                    <button
                      className="controls"
                      onClick={() =>
                        item.song_id === currentSong.songId
                          ? handlePause()
                          : handlePlaySong(item.song_id, item.preview_url)
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
                <div key={item.artist_id} id={item.artist_id} className="track">
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
                  {item.toptrack_url && (
                    <button
                      className="controls"
                      onClick={() =>
                        item.artist_id === currentSong.songId
                          ? handlePause()
                          : handlePlayArtist(item)
                      }
                    >
                      {item.artist_id === currentSong.songId ? (
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
                ".topArtists > .songs-container > .tracks-container"
              )
            }
          >
            <FiSkipForward />
          </button>
        </div>
      </div>
      {currentSong.audioUrl && (
        <WebPlayer
          url={currentSong.audioUrl}
          nextPlay={handleNextPlay}
          noControls={true}
        />
      )}
      {!currentSong.audioUrl && handleNextPlay()}
    </div>
  );
};

export default MySpace;
