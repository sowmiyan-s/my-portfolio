import React from 'react';

const ImageBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      <img
        src="/bg-image.png"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="w-full h-full object-cover object-center opacity-100 transition-opacity duration-700 select-none"
      />
    </div>
  );
};

export default ImageBackground;
