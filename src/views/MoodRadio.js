import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import Carousel from "../components/Carousel";
import WebPlayer from "../components/WebPlayer";
import { loadingAtom } from "../recoil/loadingAtom";
import { moodRadioAtom } from "../recoil/surpriseTracksAtom";
import { axiosInstance } from "../util/axiosConfig";

const MoodRadio = () => {
  const setLoading = useSetRecoilState(loadingAtom);
  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [data, setData] = useRecoilState(moodRadioAtom);

  useEffect(() => {
    if (!data) {
      setLoading(true);
      axiosInstance
        .post("/mood_radio")
        .then((res) => {
          const max_song = res.data.max_song;
          const toptracks_data = res.data.toptracks_data[0];
          const finalData = max_song.map((item, index) => {
            let obj = {
              id: index,
              name: item.name,
              artist: item.artist,
              url: item.image_url,
              preview_url: item.preview_url,
            };
            if (item.acousticness) {
              obj.type = "acoustic";
              obj.phrase = "most acoustic";
              obj.value = parseFloat(item.acousticness) * 100;
              obj.total = parseInt(parseFloat(toptracks_data.acoustic) * 100);
            } else if (item.danceability) {
              obj.type = "dance";
              obj.phrase = "most dance";
              obj.value = parseFloat(item.danceability) * 100;
              obj.total = parseInt(parseFloat(toptracks_data.dance) * 100);
            } else if (item.valence) {
              obj.type = "happy";
              obj.phrase = "happiest";
              obj.value = parseFloat(item.valence) * 100;
              obj.total = parseInt(parseFloat(toptracks_data.valence) * 100);
            } else if (item.energy) {
              obj.type = "energy";
              obj.phrase = "most energetic";
              obj.value = parseFloat(item.energy) * 100;
              obj.total = parseInt(parseFloat(toptracks_data.energy) * 100);
            } else {
            }

            return obj;
          });
          setData(finalData);
          setCurrentTrack(0);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setCurrentTrack(0);
    }
  }, []);

  useEffect(() => {
    if (currentTrack !== "") {
      const track = data.find((item) => item.id === currentTrack);
      setAudioUrl(track.preview_url);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioUrl) {
      const ct = data[currentTrack];

      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: ct.name,
        artist: ct.artist,
        artwork: [{ src: ct.url, sizes: "640x640", type: "image/jpg" }],
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
    }
  }, [audioUrl]);

  const handlePrevPlay = () => {
    if (currentTrack === 0) {
      setCurrentTrack(data[data.length - 1].id);
    } else {
      setCurrentTrack(data[currentTrack - 1].id);
    }
  };

  const handleNextPlay = () => {
    if (currentTrack === data.length - 1) {
      setCurrentTrack(data[0].id);
    } else {
      setCurrentTrack(data[currentTrack + 1].id);
    }
  };

  const handleShufflePlay = () => {
    let total = data.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(data[rnd].id);
  };

  return (
    <div className="dashboard-container mood-radio-container">
      {data && data.length > 0 && currentTrack !== "" && (
        <div className="dashboard">
          <div>
            <div className="mood-tracker">
              <div className="main">
                <span>{data[currentTrack].total}% </span>
                <span>{data[currentTrack].type}</span>
              </div>
              <div className="inner">
                <div className="dummy"></div>
                <div className="content">
                  <p>
                    Your <span>{data[currentTrack].phrase}</span> Song!
                  </p>
                  <p>{data[currentTrack].name}</p>
                  <p>{data[currentTrack].artist}</p>
                  <p>
                    {data[currentTrack].value}
                    {"% "}
                    <span>{data[currentTrack].type}</span>
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
          <Carousel data={data} current={currentTrack} />
          <div className="heading">
            <p>Your Mood Radio</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodRadio;
