import { useEffect, useState } from "react";
import { useSocket } from "../../context/socketContext";
import useDebounceCallback from "../../hooks/useDebounce";
import { axiosInstance } from "../../util/axiosConfig";

const SendASong = ({ user }) => {
  const [click, setClick] = useState(false);
  const [song, setSong] = useState("");
  const [anthem, setAnthem] = useState(null);
  const [anthemStore, setAnthemStore] = useState([]);
  const socketContext = useSocket();

  const apiCall = useDebounceCallback((value) => {
    axiosInstance
      .post("/search", { query: value, type: "track" })
      .then((res) => {
        console.log(res.data);
        setAnthemStore(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 1000);

  useEffect(() => {
    if (song) {
      apiCall(song);
    }
  }, [song]);

  const sendSong = (e) => {
    console.log("Hii", socketContext.socket);
    e.preventDefault();
    socketContext.socket?.emit("sendasong", {
      to_id: user.user_id,
      content: anthem,
    });
  };

  console.log(anthemStore, "dadgdf");

  return (
    <div>
      <button
        type="submit"
        onClick={() => {
          console.log("clicked");
          setClick(true);
        }}
        style={{ background: "orchid", cursor: "pointer !important" }}
      >
        Send a Song
      </button>
      {click && (
        <>
          <input
            type="text"
            value={song}
            onChange={(e) => {
              setSong(e.target.value);
            }}
          />
          {anthemStore.length > 0 && (
            <ul
              className="anthem-options"
              style={{ background: "black !important", maxHeight: "100px" }}
            >
              {song &&
                anthemStore.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setAnthem({
                        artists: item.artists,
                        img_url: item.image_url,
                        audio_url: item.preview_url,
                        name: item.name,
                      });
                      setAnthemStore([]);
                    }}
                  >
                    <div className="image-container">
                      <img src={item.image_url} alt={item.name} />
                    </div>
                    <span>{item.name}</span>
                  </li>
                ))}
            </ul>
          )}
        </>
      )}

      <button onClick={sendSong}>Send</button>
    </div>
  );
};

export default SendASong;
