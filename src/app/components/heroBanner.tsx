import React from "react";

const HeroBanner = () => {
  return (
    <div className="flex flex-col gap-2 max-w-5xl h-screen justify-center">
      <h2>The only way to do great work is to love what you do.</h2>
      <h3 className="self-end relative right-[5%] md:right-[15%]">
        - Steve Jobs
      </h3>
    </div>
  );
};

export default HeroBanner;
