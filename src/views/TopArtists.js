import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import ArtistList from "../components/ArtistList";
import Carousel from "../components/Carousel";
import WebPlayer from "../components/WebPlayer";
import useTopArtists from "../hooks/useTopArtists";
import { topArtistsLongAtom } from "../recoil/topArtistsAtom";

const TopArtists = () => {
  const { getTopArtistsLong } = useTopArtists();
  const topArtistsLong = useRecoilValue(topArtistsLongAtom);

  const [currentArtist, setCurrentArtist] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    if (!topArtistsLong.artists) {
      getTopArtistsLong();
    } else {
      setCurrentArtist(topArtistsLong.artists[0].artist_id);
    }
  }, [topArtistsLong]);

  useEffect(() => {
    if (currentArtist) {
      changeArtist(currentArtist);
    }
  }, [currentArtist]);

  const changeArtist = (artistId) => {
    const newArtist = topArtistsLong.artists.filter(
      (artist) => artist.artist_id === artistId
    );

    let songUrl = newArtist[0].toptrack_url;

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
    topArtistsLong.artists.forEach((item, ind) => {
      if (item.artist_id === currentArtist) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentArtist(
        topArtistsLong.artists[topArtistsLong.artists.length - 1].artist_id
      );
    } else {
      setCurrentArtist(topArtistsLong.artists[index - 1].artist_id);
    }
  };

  const handleNextPlay = () => {
    let index;
    topArtistsLong.artists.forEach((item, ind) => {
      if (item.artist_id === currentArtist) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === topArtistsLong.artists.length - 1) {
      setCurrentArtist(topArtistsLong.artists[0].artist_id);
    } else {
      setCurrentArtist(topArtistsLong.artists[index + 1].artist_id);
    }
  };

  const handleShufflePlay = () => {
    let total = topArtistsLong.artists.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentArtist(topArtistsLong.artists[rnd].artist_id);
  };

  return (
    <div className="dashboard-container">
      {topArtistsLong.artists &&
        topArtistsLong.artists.length > 0 &&
        currentArtist && (
          <div className="dashboard">
            <div>
              <ArtistList
                currentArtist={currentArtist}
                artists={topArtistsLong.artists}
                changeArtist={handleArtistChange}
              />
              <WebPlayer
                url={audioUrl}
                prevPlay={handlePrevPlay}
                nextPlay={handleNextPlay}
                shufflePlay={handleShufflePlay}
              />
            </div>
            <Carousel data={topArtistsLong.images} current={currentArtist} />
            <div className="heading">
              <p>Your Top Artists Radio</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default TopArtists;
