import React, { useEffect, useState } from "react";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import image3 from "../assets/images/artists/image3.png";
import image5 from "../assets/images/artists/image5.png";
import WebPlayer from "../components/WebPlayer";
import useTopArtists from "../hooks/useTopArtists";
import useTopTracks from "../hooks/useTopTracks";
import { loadingAtom } from "../recoil/loadingAtom";
import { topArtistsLongAtom } from "../recoil/topArtistsAtom";
import { topTracksLongAtom } from "../recoil/topTracksAtom";
import { paddedNumbers } from "../util/functions";

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
  const setLoading = useSetRecoilState(loadingAtom);
  const { getTopTracksLong } = useTopTracks();
  const { getTopArtistsLong } = useTopArtists();
  const topTracks = useRecoilValue(topTracksLongAtom);
  const topArtists = useRecoilValue(topArtistsLongAtom);
  const [currentSong, setCurrentSong] = useState({
    songId: null,
    audioUrl: null,
    list: "topTracks",
    genre: [],
  });

  const [songNumber, setSongNumber] = useState({
    tracks: 1,
    artists: 1,
  });

  useEffect(() => {
    setLoading(true);
    if (!topTracks.tracks && !topArtists.artists) {
      getTopTracksLong(true);
    }

    if (!topArtists.artists) {
      getTopArtistsLong(true);
    }

    setLoading(false);
  }, [topTracks.tracks, topArtists.artists]);

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
      let children = container.children;
      let index = 0;
      while (children[index].id !== currentSong.songId) {
        index++;
      }
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

  const handleSetAndPlayArtist = (num, item) => {
    setSongNumber({ ...songNumber, artists: num });
    handlePlayArtist(item);
  };

  const handleSetAndPlayTrack = (num, songId, audioUrl) => {
    setSongNumber({ ...songNumber, tracks: num });
    handlePlaySong(songId, audioUrl);
  };

  const handlePlaySong = (songId, audioUrl, list = "topTracks", genre = []) => {
    setCurrentSong({
      ...currentSong,
      songId,
      audioUrl,
      list,
      genre,
    });
  };

  const handlePlayArtist = (artist) => {
    handlePlaySong(
      artist.artist_id,
      artist.toptrack_url,
      "topArtists",
      artist.genres
    );
  };

  const handleNextPlay = () => {
    if (topTracks && topTracks.tracks && currentSong.list === "topTracks") {
      const track = topTracks.tracks.find(
        (item) => item.song_id === currentSong.songId
      );
      const index = topTracks.tracks.indexOf(track);
      if (index + 1 !== topTracks.tracks.length) {
        setSongNumber({ ...songNumber, tracks: index + 2 });
        handlePlaySong(
          topTracks.tracks[index + 1].song_id,
          topTracks.tracks[index + 1].preview_url
        );
      } else {
        setSongNumber({ ...songNumber, tracks: 1 });
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
        setSongNumber({ ...songNumber, artists: index + 2 });
        handlePlayArtist(topArtists.artists[index + 1]);
      } else {
        setSongNumber({ ...songNumber, artists: 1 });
        handlePlayArtist(topArtists.artists[0]);
      }
    }
  };

  const handlePause = () => {
    setCurrentSong({
      ...currentSong,
      songId: null,
      audioUrl: null,
      list: null,
    });
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
              topTracks.tracks.map((item, idx) => (
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
                          : handleSetAndPlayTrack(
                              idx + 1,
                              item.song_id,
                              item.preview_url
                            )
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
        {topTracks.tracks && topTracks.tracks.length > 0 && (
          <div className="metadata-container">
            <div className="dots-container">
              <div
                className={`dot ${
                  songNumber.tracks <= parseInt(topTracks.tracks.length / 3)
                    ? "highlight"
                    : ""
                }`}
              ></div>
              <div
                className={`dot ${
                  songNumber.tracks > parseInt(topTracks.tracks.length / 3) &&
                  songNumber.tracks <=
                    parseInt((2 * topTracks.tracks.length) / 3)
                    ? "highlight"
                    : ""
                }`}
              ></div>
              <div
                className={`dot ${
                  songNumber.tracks >
                    parseInt((2 * topTracks.tracks.length) / 3) &&
                  songNumber.tracks <= topTracks.tracks.length
                    ? "highlight"
                    : ""
                }`}
              ></div>
            </div>
            <div className="song-number">
              <span>{`${paddedNumbers(songNumber.tracks)}`}</span>
              <span>{`/${topTracks.tracks && topTracks.tracks.length}`}</span>
            </div>
          </div>
        )}
      </div>
      <div className="topArtists">
        <div className="upper-container">
          <div className="title">Top Artists</div>
        </div>
        <div className="genres-container">
          {currentSong.genre &&
            currentSong.genre.length > 0 &&
            currentSong.genre.map((genre) => (
              <div key={genre} className="genre">
                {genre}
              </div>
            ))}
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
              topArtists.artists.map((item, idx) => (
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
                          : handleSetAndPlayArtist(idx + 1, item)
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
        {topArtists.artists && topArtists.artists.length > 0 && (
          <div className="metadata-container">
            <div className="dots-container">
              <div
                className={`dot ${
                  songNumber.artists <= parseInt(topArtists.artists.length / 3)
                    ? "highlight"
                    : ""
                }`}
              ></div>
              <div
                className={`dot ${
                  songNumber.artists > topArtists.artists.length / 3 &&
                  songNumber.artists <=
                    parseInt(2 * topArtists.artists.length) / 3
                    ? "highlight"
                    : ""
                }`}
              ></div>
              <div
                className={`dot ${
                  songNumber.artists >
                    parseInt(2 * topArtists.artists.length) / 3 &&
                  songNumber.artists <= topArtists.artists.length
                    ? "highlight"
                    : ""
                }`}
              ></div>
            </div>
            <div className="song-number">
              <span>{`${paddedNumbers(songNumber.artists)}`}</span>
              <span>{`/${
                topArtists.artists && topArtists.artists.length
              }`}</span>
            </div>
          </div>
        )}
      </div>
      {currentSong.audioUrl && (
        <WebPlayer
          url={currentSong.audioUrl}
          nextPlay={handleNextPlay}
          noControls={true}
        />
      )}
      {currentSong.songId && !currentSong.audioUrl && handleNextPlay()}
    </div>
  );
};

export default MySpace;
