import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import logo from "../assets/images/logo-black.png";
import Carousel from "../components/Carousel";
import CustomHelmet from "../components/CustomHelmet";
import Skeleton from "../components/Skeleton";
import WebPlayer from "../components/WebPlayer";
import { alertAtom } from "../recoil/alertAtom";
import { userState } from "../recoil/userAtom";
import { axiosInstance } from "../util/axiosConfig";

const MoodRadio = () => {
  const [user, setUser] = useRecoilState(userState);
  const setAlert = useSetRecoilState(alertAtom);

  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    if (!user.moodRadio) {
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
              url: item.image_url || logo,
              preview_url: item.preview_url,
            };
            if (item.acousticness) {
              obj.type = "acoustic";
              obj.phrase = "most acoustic";
              obj.value = (parseFloat(item.acousticness) * 100).toFixed(0);
              obj.total = parseInt(parseFloat(toptracks_data.acoustic) * 100);
            } else if (item.danceability) {
              obj.type = "dance";
              obj.phrase = "most dance";
              obj.value = (parseFloat(item.danceability) * 100).toFixed(0);
              obj.total = parseInt(parseFloat(toptracks_data.dance) * 100);
            } else if (item.valence) {
              obj.type = "happy";
              obj.phrase = "happiest";
              obj.value = (parseFloat(item.valence) * 100).toFixed(0);
              obj.total = parseInt(parseFloat(toptracks_data.valence) * 100);
            } else if (item.energy) {
              obj.type = "energy";
              obj.phrase = "most energetic";
              obj.value = (parseFloat(item.energy) * 100).toFixed(0);
              obj.total = parseInt(parseFloat(toptracks_data.energy) * 100);
            } else {
            }

            return obj;
          });
          setUser({
            ...user,
            moodRadio: finalData,
          });
          setCurrentTrack(0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setCurrentTrack(0);
    }
  }, [user.moodRadio]);

  useEffect(() => {
    if (currentTrack !== "") {
      const track = user.moodRadio.find((item) => item.id === currentTrack);
      setAudioUrl(track.preview_url);
      if (!track.preview_url) {
        setAlert({
          open: true,
          message: `Cannot play this track!`,
          type: "error",
        });
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioUrl) {
      const ct = user.moodRadio[currentTrack];

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
      setCurrentTrack(user.moodRadio[user.moodRadio.length - 1].id);
    } else {
      setCurrentTrack(user.moodRadio[currentTrack - 1].id);
    }
  };

  const handleNextPlay = () => {
    if (currentTrack === user.moodRadio.length - 1) {
      setCurrentTrack(user.moodRadio[0].id);
    } else {
      setCurrentTrack(user.moodRadio[currentTrack + 1].id);
    }
  };

  const handleShufflePlay = () => {
    let total = user.moodRadio.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(user.moodRadio[rnd].id);
  };

  return (
    <>
      <CustomHelmet
        title="Mood Radio"
        description="Get your most acoustic, energetic, happiest dance tunes"
        keywords="Mood Radio, Happy, Energy, Acoustic, Dance"
      />
      <div className="dashboard-container mood-radio-container">
        <div className="dashboard">
          <div>
            {!user.moodRadio ? (
              <div className="mood-tracker">
                <div className="main">
                  <Skeleton type="text" />
                </div>
                <div className="inner">
                  <div className="dummy"></div>
                  <div className="content">
                    <Skeleton type="text" />
                    <Skeleton type="text" />
                    <Skeleton type="text" />
                    <Skeleton type="text" />
                  </div>
                </div>
              </div>
            ) : (
              user.moodRadio.length > 0 &&
              currentTrack !== "" && (
                <div className="mood-tracker">
                  <div className="main">
                    <span>{user.moodRadio[currentTrack].total}% </span>
                    <span>{user.moodRadio[currentTrack].type}</span>
                  </div>
                  <div className="inner">
                    <div className="dummy"></div>
                    <div className="content">
                      <p>
                        Your <span>{user.moodRadio[currentTrack].phrase}</span>{" "}
                        Song!
                      </p>
                      <p>{user.moodRadio[currentTrack].name}</p>
                      <p>{user.moodRadio[currentTrack].artist}</p>
                      <p>
                        {user.moodRadio[currentTrack].value}
                        {"% "}
                        <span>{user.moodRadio[currentTrack].type}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
            <WebPlayer
              url={audioUrl}
              prevPlay={handlePrevPlay}
              nextPlay={handleNextPlay}
              shufflePlay={handleShufflePlay}
            />
          </div>
          <Carousel data={user.moodRadio} current={currentTrack} />
          <div className="heading">
            <p>Your Mood Radio</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoodRadio;
