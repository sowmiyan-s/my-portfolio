import React from 'react';

const ImageBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden bg-black">
      <img
        src="/assets/bg-image.png"
        alt="Site Background"
        className="w-full h-full object-cover object-center opacity-75 transition-opacity duration-700 select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
    </div>
  );
};

export default ImageBackground;
