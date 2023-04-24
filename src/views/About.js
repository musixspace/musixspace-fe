import React from "react";
import img2 from "../assets/images/artists/image2.png";
import img1 from "../assets/images/artists/image3.png";
import CustomHelmet from "../components/CustomHelmet";

const people = [
  {
    id: 1,
    name: "Amaya Srivastava",
    position: "Music Hacker",
    img: img1,
  }
];

const About = () => {
  return (
    <>
      <CustomHelmet
        title="About Us"
        description="Get to know the team"
        keywords="About, Amaya Srivastava, Ayush Srivastava"
      />
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
    </>
  );
};

export default About;
