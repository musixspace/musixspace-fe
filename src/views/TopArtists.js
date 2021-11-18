import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import ArtistList from "../components/ArtistList";
import Carousel from "../components/Carousel";
import WebPlayer from "../components/WebPlayer";
import useTopArtists from "../hooks/useTopArtists";
import { userState } from "../recoil/userAtom";
import { setMediaSession } from "../util/functions";
import logo from "../assets/images/logo-black.png";

const TopArtists = () => {
  const user = useRecoilValue(userState);
  const { getTopArtistsLong } = useTopArtists();

  const [currentArtist, setCurrentArtist] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    if (!user.topArtistsLong.artists) {
      getTopArtistsLong(user.username || localStorage.getItem("handle"));
    } else {
      setCurrentArtist(user.topArtistsLong.artists[0].artist_id);
    }
  }, [user.topArtistsLong]);

  useEffect(() => {
    if (currentArtist) {
      changeArtist(currentArtist);
    }
  }, [currentArtist]);

  useEffect(() => {
    if (audioUrl) {
      const ct = user.topArtistsLong.artists.find(
        (item) => item.artist_id === currentArtist
      );

      setMediaSession(
        ct.toptrack.name,
        ct.name,
        ct.image_url || logo,
        handlePrevPlay,
        handleNextPlay
      );
    }
  }, [audioUrl]);

  const changeArtist = (artistId) => {
    const newArtist = user.topArtistsLong.artists.find(
      (artist) => artist.artist_id === artistId
    );

    let songUrl = newArtist.toptrack ? newArtist.toptrack.preview_url : null;

    if (songUrl) {
      setAudioUrl(songUrl);
    } else {
      handleNextPlay();
    }
  };

  const handleArtistChange = (artistId) => {
    setCurrentArtist(artistId);
  };

  const handlePrevPlay = () => {
    let index;
    user.topArtistsLong.artists.forEach((item, ind) => {
      if (item.artist_id === currentArtist) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentArtist(
        user.topArtistsLong.artists[user.topArtistsLong.artists.length - 1]
          .artist_id
      );
    } else {
      setCurrentArtist(user.topArtistsLong.artists[index - 1].artist_id);
    }
  };

  const handleNextPlay = () => {
    let index;
    user.topArtistsLong.artists.forEach((item, ind) => {
      if (item.artist_id === currentArtist) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === user.topArtistsLong.artists.length - 1) {
      setCurrentArtist(user.topArtistsLong.artists[0].artist_id);
    } else {
      setCurrentArtist(user.topArtistsLong.artists[index + 1].artist_id);
    }
  };

  const handleShufflePlay = () => {
    let total = user.topArtistsLong.artists.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentArtist(user.topArtistsLong.artists[rnd].artist_id);
  };

  return (
    <div className="dashboard-container">
      {user.topArtistsLong.artists &&
        user.topArtistsLong.artists.length > 0 &&
        currentArtist && (
          <div className="dashboard">
            <div>
              <ArtistList
                currentArtist={currentArtist}
                artists={user.topArtistsLong.artists}
                changeArtist={handleArtistChange}
              />
              <WebPlayer
                url={audioUrl}
                prevPlay={handlePrevPlay}
                nextPlay={handleNextPlay}
                shufflePlay={handleShufflePlay}
              />
            </div>
            <Carousel
              data={user.topArtistsLong.images}
              current={currentArtist}
            />
            <div className="heading">
              <p>Your Top Artists Radio</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default TopArtists;
