import React, { useEffect, useState } from "react";
import { FiCheck, FiSearch, FiX } from "react-icons/fi";
import Navbar from "../components/Navbar";
import ambivert from "../assets/images/bgs/ambi.png";
import extrovert from "../assets/images/bgs/extrovert.png";
import party from "../assets/images/bgs/party.png";
import easy from "../assets/images/bgs/readytorock.png";

const traits = [
  { id: 1, name: "introvert", img: ambivert },
  { id: 2, name: "easy going", img: easy },
  { id: 3, name: "extrovert", img: extrovert },
  { id: 4, name: "party animal", img: party },
  { id: 5, name: "ambivert", img: ambivert },
  { id: 6, name: "lone wolf", img: easy },
  { id: 7, name: "quiet", img: extrovert },
  { id: 8, name: "weirdo", img: party },
];

const Rolling = () => {
  const [search, setSearch] = useState("");
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [traitsList, setTraitsList] = useState(traits);

  useEffect(() => {
    if (search !== "") {
      const newArr = traits.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setTraitsList(newArr);
    } else {
      setTraitsList(traits);
    }
  }, [search]);

  const handleSelectTrait = (id) => {
    let flag = false;
    let index = null;
    selectedTraits.forEach((item, ind) => {
      if (item === id) {
        flag = true;
        index = ind;
      }
    });
    if (flag) {
      const newArr = [...selectedTraits];
      newArr.splice(index, 1);
      setSelectedTraits(newArr);
    } else {
      if (selectedTraits.length < 3) {
        const newArr = [...selectedTraits, id];
        setSelectedTraits(newArr);
      }
    }
  };

  return (
    <div className="wrapper" style={{ backgroundColor: "var(--clr-black)" }}>
      <Navbar />
      <div className="rolling">
        <div className="container">
          <p>Choose 3 personality traits</p>
          <div className="searchbar">
            <FiSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search here"
            />
            <FiX onClick={() => setSearch("")} />
          </div>
          <div className="traits-container">
            {traitsList.length > 0 ? (
              traitsList.map((trait) => (
                <div
                  key={trait.id}
                  className="trait"
                  onClick={() => handleSelectTrait(trait.id)}
                >
                  {selectedTraits.includes(trait.id) ? (
                    <div className="check">
                      <FiCheck />
                    </div>
                  ) : null}
                  <div className="image-container">
                    <img src={trait.img} alt={trait.name} />
                  </div>
                  <p>{trait.name}</p>
                </div>
              ))
            ) : (
              <div className="empty">No results found</div>
            )}
          </div>
          <div className="button-container">
            <button>Get me rolling</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rolling;
