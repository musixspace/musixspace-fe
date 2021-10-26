import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Carousel from "../components/Carousel";
import Navbar from "../components/Navbar";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import { axiosInstance } from "../util/axiosConfig";
import axios from "axios";

const TopTracks = () => {
    const history = useHistory();
    const [topTracks, setTopTracks] = useState(null);
    const [currentTrack, setCurrentTrack] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [images, setImages] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {


            const payload = {
                pip: "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=30",
                spotify_id: localStorage.getItem("spotifyId"),
            };


            axios
                .post(`${process.env.REACT_APP_BACKEND_URI}/spotifyget`, payload, {
                    headers: {
                        //"Content-Type": "application/json",
                        "jwt_token": localStorage.getItem("accessToken"),
                    },
                })
                .then((res) => {
                    if (res.status === 200) {
                        let imgArr = [];
                        res.data.items.forEach((item) => {
                            imgArr.push({ id: item.id, url: item.album.images[0].url });
                        });
                        setImages(imgArr);
                        setTopTracks(res.data.items);
                        setCurrentTrack(res.data.items[0].id);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

        } else {
            history.push("/");
        }
    }, []);

    useEffect(() => {
        if (currentTrack) {
            changeTrack(currentTrack);
        }
    }, [currentTrack]);

    const changeTrack = (trackId) => {


        const payload = {
            pip: `https://api.spotify.com/v1/tracks/${trackId}?market=IN`,
            spotify_id: localStorage.getItem("spotifyId"),
        };


        axios
            .post(`${process.env.REACT_APP_BACKEND_URI}/spotifyget`, payload, {
                headers: {
                    //"Content-Type": "application/json",
                    "jwt_token": localStorage.getItem("accessToken"),
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    setCurrentTrack(trackId);
                    if (res.data.preview_url) {
                        setAudioUrl(res.data.preview_url);
                    } else {
                        handleNextPlay();
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });


    };

    const handleTrackChange = (trackId) => {
        setCurrentTrack(trackId);
    };

    const handlePrevPlay = () => {
        let index;
        topTracks.forEach((item, ind) => {
            if (item.id === currentTrack) {
                index = ind;
            }
        });

        // console.log(index);

        if (index === 0) {
            setCurrentTrack(topTracks[topTracks.length - 1].id);
        } else {
            setCurrentTrack(topTracks[index - 1].id);
        }
    };

    const handleNextPlay = () => {
        let index;
        topTracks.forEach((item, ind) => {
            if (item.id === currentTrack) {
                index = ind;
            }
        });

        // console.log(index);

        if (index === topTracks.length - 1) {
            setCurrentTrack(topTracks[0].id);
        } else {
            setCurrentTrack(topTracks[index + 1].id);
        }
    };

    const handleShufflePlay = () => {
        let total = topTracks.length;
        let rnd = Math.floor(Math.random() * total);
        setCurrentTrack(topTracks[rnd].id);
    };

    return (
        <div
      className="wrapper"
      style={{ backgroundColor: "var(--bg-top-tracks)" }}
    >
      <Navbar />
      <div className="dashboard-container">
        {topTracks && topTracks.length > 0 && currentTrack && (
          <div className="dashboard">
            <div>
              <TrackList
                currentTrack={currentTrack}
                tracks={topTracks}
                changeTrack={handleTrackChange}
              />
              <WebPlayer
                url={audioUrl}
                prevPlay={handlePrevPlay}
                nextPlay={handleNextPlay}
                shufflePlay={handleShufflePlay}
              />
            </div>
            <Carousel data={images} current={currentTrack} />
            <div className="heading">
              <p>Your Top Tracks Radio</p>
              <div>
                <p>30 sec</p>
                <button id="export">Export</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    );
};

export default TopTracks;