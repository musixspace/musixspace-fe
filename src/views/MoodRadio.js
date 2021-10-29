import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import WebPlayer from "../components/WebPlayer";

const moods = [
  {
    id: 0,
    type: "acoustic",
    preview_url:
      "https://p.scdn.co/mp3-preview/cfd51dc9130744585c987aed71d66f9b3470e689?cid=91ac019cb27f4ee589ceef18cb39c0f1",
    name: "Intro",
    artist: "Penn Masala",
    value: "87",
    total: "45",
    url: "https://i.scdn.co/image/ab67616d0000b273872d46b839e3103bb1d97ea3",
  },
  {
    id: 1,
    type: "dance",
    preview_url:
      "https://p.scdn.co/mp3-preview/4de62d1780477499102f226641fee4169455107f?cid=91ac019cb27f4ee589ceef18cb39c0f1",
    name: "Jai Jai Shivshankar",
    artist: "Vishal Dadlani",
    value: "82",
    total: "56",
    url: "https://i.scdn.co/image/ab67616d0000b2738874d42c6591770e15618d13",
  },
  {
    id: 2,
    type: "energy",
    preview_url:
      "https://p.scdn.co/mp3-preview/368740ff5943a9ffcf5c212d28a5deffea732ac2?cid=91ac019cb27f4ee589ceef18cb39c0f1",
    name: "La La La - Bang Bang",
    artist: "Penn Masala",
    value: "90",
    total: "58",
    url: "https://i.scdn.co/image/ab67616d0000b273872d46b839e3103bb1d97ea3",
  },
  {
    id: 3,
    type: "happy",
    preview_url:
      "https://p.scdn.co/mp3-preview/49b2fa0b4f6f5a24f364e12a9fd558c814a79e9e?cid=91ac019cb27f4ee589ceef18cb39c0f1",
    name: "Mast Magan",
    artist: "Arjit Singh",
    value: "85",
    total: "55",
    url: "https://i.scdn.co/image/ab67616d0000b273c7b8d39b1e113845906984ab",
  },
];

const MoodRadio = () => {
  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [images, setImages] = useState(null);

  useEffect(() => {
    setImages(moods);
    setCurrentTrack(0);
  }, []);

  useEffect(() => {
    if (currentTrack !== "") {
      const track = moods.find((item) => item.id === currentTrack);
      setAudioUrl(track.preview_url);
    }
  }, [currentTrack]);

  const handlePrevPlay = () => {
    if (currentTrack === 0) {
      setCurrentTrack(moods[moods.length - 1].id);
    } else {
      setCurrentTrack(moods[currentTrack - 1].id);
    }
  };

  const handleNextPlay = () => {
    if (currentTrack === moods.length - 1) {
      setCurrentTrack(moods[0].id);
    } else {
      setCurrentTrack(moods[currentTrack + 1].id);
    }
  };

  const handleShufflePlay = () => {
    let total = moods.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(moods[rnd].id);
  };

  return (
    <div className="dashboard-container">
      {moods && moods.length > 0 && currentTrack !== "" && (
        <div className="dashboard">
          <div>
            <div className="mood-tracker">
              <div className="main">
                <span>{moods[currentTrack].total}% </span>
                <span>{moods[currentTrack].type}</span>
              </div>
              <div className="inner">
                <div className="dummy"></div>
                <div className="content">
                  <p>
                    Your Most <span>{moods[currentTrack].type}</span> Song!
                  </p>
                  <p>{moods[currentTrack].name}</p>
                  <p>{moods[currentTrack].artist}</p>
                  <p>
                    {moods[currentTrack].value}
                    {"% "}
                    <span>{moods[currentTrack].type}</span>
                  </p>
                </div>
              </div>
            </div>
            <WebPlayer
              url={audioUrl}
              prevPlay={handlePrevPlay}
              nextPlay={handleNextPlay}
              shufflePlay={handleShufflePlay}
            />
          </div>
          <Carousel data={images} current={currentTrack} />
          <div className="heading">
            <p>Your Mood Radio</p>
            <div>
              <p>30 sec</p>
              <button id="export">Export</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodRadio;
