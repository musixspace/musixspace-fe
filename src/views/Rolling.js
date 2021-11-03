import React, { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { useHistory } from "react-router";
import { axiosInstance } from "../util/axiosConfig";
import ambivert from "../assets/images/bgs/ambi.png";
import easy from "../assets/images/bgs/easy.png";
import extrovert from "../assets/images/bgs/extrovert.png";
import introvert from "../assets/images/bgs/introvert.png";
import lonewolf from "../assets/images/bgs/lonewolf.png";
import party from "../assets/images/bgs/party.png";
import quiet from "../assets/images/bgs/quiet.png";
import weirdo from "../assets/images/bgs/weirdo.png";

const traits = [
  { id: 1, name: "introvert", img: introvert },
  { id: 2, name: "easy going", img: easy },
  { id: 3, name: "extrovert", img: extrovert },
  { id: 4, name: "party animal", img: party },
  { id: 5, name: "ambivert", img: ambivert },
  { id: 6, name: "lone wolf", img: lonewolf },
  { id: 7, name: "quiet", img: quiet },
  { id: 8, name: "weirdo", img: weirdo },
];

const Rolling = () => {
  const history = useHistory();
  const [selectedTraits, setSelectedTraits] = useState([]);

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

  const onHanldeSubmit = () => {
    let plist = traits.map((item) => {
      if (selectedTraits.includes(item.id)) return item.name;
      return null;
    });
    plist = plist.filter((item) => item);
    axiosInstance
      .post("/traits", { plist })
      .then((res) => {
        history.push("/insights");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="rolling">
      <div className="container">
        <p>Choose 3 personality traits</p>
        <div className="traits-container">
          {traits.length > 0 ? (
            traits.map((trait) => (
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
          <button
            onClick={onHanldeSubmit}
            className={`${selectedTraits.length < 3 ? "hide" : ""}`}
          >
            Get me rolling
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rolling;
