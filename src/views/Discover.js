import React, { useState } from "react";
import { FiSearch, FiSkipBack, FiSkipForward, FiX } from "react-icons/fi";
import flume from "../assets/images/artists/flume.png";
import image1 from "../assets/images/artists/image1.png";
import image2 from "../assets/images/artists/image2.png";
import image3 from "../assets/images/artists/image3.png";
import image4 from "../assets/images/artists/image4.png";
import image5 from "../assets/images/artists/image5.png";
import lewis from "../assets/images/artists/lewis.png";
import logoWhite from "../assets/images/logo-white.png";
import prateek from "../assets/images/artists/prateek.png";
import Navbar from "../components/Navbar";

const user = [
  {
    img: image3,
    name: "Amaya Srivastava",
    bio: "Old school guy. Hmu if you love indian-indies more than anything!",
    tags: ["introvert", "easy going"],
    anthem: {
      title: "Nikamma",
      album: "Lifafa",
      img: image5,
    },
    artists: [
      { name: "Lewis Capaldi", img: lewis },
      { name: "Ritviz", img: image4 },
      { name: "Flume", img: flume },
      { name: "Prateek Kuhad", img: prateek },
    ],
    common: 24,
  },
  {
    img: image4,
    name: "Ayush Srivastava",
    bio: "Hi this is Ayush! I love rock and party music!",
    tags: ["extrovert", "party animal"],
    anthem: {
      title: "Nikamma",
      album: "Lifafa",
      img: image5,
    },
    artists: [
      { name: "Lewis Capaldi", img: lewis },
      { name: "Ritviz", img: image4 },
      { name: "Flume", img: flume },
      { name: "Prateek Kuhad", img: prateek },
    ],
    common: 15,
  },
  {
    img: image1,
    name: "Rohit Rana",
    bio: "Hi this is Rohit! I love romantic hits and sad songs!",
    tags: ["introvert", "romantic"],
    anthem: {
      title: "Nikamma",
      album: "Lifafa",
      img: image5,
    },
    artists: [
      { name: "Lewis Capaldi", img: lewis },
      { name: "Ritviz", img: image4 },
      { name: "Flume", img: flume },
      { name: "Prateek Kuhad", img: prateek },
    ],
    common: 7,
  },
  {
    img: image2,
    name: "Atharva Jangada",
    bio: "Hi this is Atharva! I love 90's bollywood hits and big Hrithik Roshan fan!",
    tags: ["bollywood", "romantic"],
    anthem: {
      title: "Nikamma",
      album: "Lifafa",
      img: image5,
    },
    artists: [
      { name: "Lewis Capaldi", img: lewis },
      { name: "Ritviz", img: image4 },
      { name: "Flume", img: flume },
      { name: "Prateek Kuhad", img: prateek },
    ],
    common: 25,
  },
];

// const handleTouchStart = (e) => {
//   console.log("Touch Start");
//   console.log(e);
// };

// const handleTouchMove = (e) => {
//   console.log("Touch Move");
//   console.log(e);
// };

// const handleTouchEnd = (e) => {
//   console.log("Touch end");
//   console.log(e);
// };

const Discover = () => {
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(0);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePrevUser = () => {
    if (current === 0) {
      setCurrent(user.length - 1);
    } else {
      setCurrent((prev) => prev - 1);
    }
  };

  const handleNextUser = () => {
    if (current === user.length - 1) {
      setCurrent(0);
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  return (
    <div className="wrapper" style={{ backgroundColor: "var(--clr-black)" }}>
      <Navbar />
      <div className="discover-container">
        <div className="searchbar">
          <div></div>
          <div>
            <FiSearch />
            <input
              value={search}
              onChange={handleSearch}
              type="text"
              placeholder="Discover your friends"
            />
            <FiX onClick={() => setSearch("")} />
          </div>
          <div></div>
        </div>
        <div className="discover">
          <div className="prev">
            <FiSkipBack onClick={handlePrevUser} />
          </div>
          <div className="user">
            <div className="image-container">
              <img src={user[current].img} alt={user[current].name} />
              <div className="overlap">
                <img src={logoWhite} alt="Musixspace Logo" />
                <button>View Space</button>
              </div>
            </div>
            <div className="content-container">
              <div className="main-content">
                <div className="name">{user[current].name}</div>
                <div className="tags">
                  {user[current].tags.map((tag) => (
                    <div key={tag} className="tag">
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="bio">"{user[current].bio}"</div>
              </div>
              <div className="inner-content">
                <div className="anthem">
                  <div className="title">{user[current].name}'s Anthem</div>
                  <div className="anthem-content">
                    <div className="anthem-image">
                      <img
                        src={user[current].anthem.img}
                        alt={user[current].anthem.title}
                      />
                    </div>
                    <div>
                      <div className="anthem-title">
                        {user[current].anthem.title}
                      </div>
                      <div className="anthem-album">
                        {user[current].anthem.album}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="interests">
                  <div className="title">{user[current].name} X You</div>
                  <div className="list">
                    {user[current].artists.map((item) => (
                      <div key={item.name} className="artist">
                        <div>
                          <img src={item.img} alt={item.name} />
                        </div>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="common">
                    +{user[current].common} common interests
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="next">
            <FiSkipForward onClick={handleNextUser} />
          </div>
          <div className="mobile-visible">
            <FiSkipBack onClick={handlePrevUser} />
            <FiSkipForward onClick={handleNextUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
