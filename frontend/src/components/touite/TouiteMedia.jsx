import React from "react";

const TouiteMedia = ({ media }) => (
  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 rounded-xl overflow-hidden">
    {media.map((src, idx) => (
      <img
        key={idx}
        src={src}
        alt={`Touite media ${idx + 1}`}
        className="w-full object-cover aspect-video rounded-lg"
      />
    ))}
  </div>
);

export default TouiteMedia;
