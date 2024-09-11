import React from "react";

const Marquee = ({ text, separator }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap py-4 relative z-20 text-white border-y-[1px] ">
      <div className="flex space-x-4 animate-marquee">
        {[...text, ...text, ...text, ...text].map((item, index) => (
          <React.Fragment key={index}>
            <span className="mx-2 text-[24px]">{item}</span>
            {index < text.length * 2 - 1 && (
              <span className="mx-2">{separator}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
