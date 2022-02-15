import logo from "../assets/images/logo-black.png";
const Audio = ({ image_url, name, artists, preview_url }) => {
  return (
    <div className="song-wrapper">
      <div className="info-wrapper">
        <div className="image-container">
          <img src={image_url || logo} alt={name} />
          {/* {audioUrl && audioUrl === data.preview_url ? <FaPause /> : <FaPlay />} */}
        </div>
        <div className="content-container">
          <p>{name}</p>
          <div className="meta">
            <p>
              {artists
                .map((item) => item.name)
                .slice(0, 3)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
      {/* <div className="audio-container"> */}
      <audio controls>
        <source src={preview_url} type="audio/mp3" />
      </audio>
      {/* </div> */}
    </div>
  );
};
export default Audio;
