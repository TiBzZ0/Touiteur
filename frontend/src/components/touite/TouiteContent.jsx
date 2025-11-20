import React from "react";

const TouiteContent = ({ content }) => (
  <p style={{ whiteSpace: 'pre-wrap', wordBreak: "break-word"}} className="text-[color:var(--foreground)] text-sm sm:text-base leading-normal mb-2">
    {content}
  </p>
);

export default TouiteContent;
