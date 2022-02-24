import React from "react";
import { Helmet } from "react-helmet";
import logo from "../assets/images/logo.png";

const CustomHelmet = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{`${title} | Musixspace`}</title>
      <meta property="og:title" content={`${title} | Musixspace`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:image" itemProp="image" content={logo} />
      <meta property="og:image:width" content="256" />
      <meta property="og:image:height" content="256" />
      <meta
        property="og:keywords"
        content={`${keywords}, Musixspace, Music, Spotify`}
      />
    </Helmet>
  );
};

export default CustomHelmet;
