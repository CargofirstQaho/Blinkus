import React from "react";

const HowItWorksVideo = () => {
  return (
    <div className="flex items-center justify-center px-4 pt-4 md:pt-10">
      <div className="w-full max-w-4xl aspect-video">
        <iframe
          className="w-full h-full rounded-lg shadow-lg"
          src="https://www.youtube.com/embed/Y0GWXSyVPf0?autoplay=1&mute=1&controls=0&rel=0"
          title="How It Works Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default HowItWorksVideo;













