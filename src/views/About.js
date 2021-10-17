import React from "react";
import Navbar from "../components/Navbar";
import img1 from "../assets/images/image3.png";
import img2 from "../assets/images/image2.png";

const people = [
  {
    id: 1,
    name: "Amaya Srivastava",
    position: "Hipster, Rockstar, Design",
    img: img1,
  },
  {
    id: 2,
    name: "Ayush Srivastava",
    position: "Founder",
    img: img2,
  },
];

const About = () => {
  return (
    <div className="wrapper" style={{ backgroundColor: "var(--bg-about)" }}>
      <Navbar />
      <div className="about">
        {people.map((person) => (
          <div key={person.id} className="person">
            <div className="content">
              <p>#{person.id}</p>
              <p>{person.name}</p>
              <p>{person.position}</p>
            </div>
            <div className="person-img">
              <img src={person.img} alt={person.name} />
              <p>
                Meet <br /> The Band.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
