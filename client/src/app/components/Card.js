import React from "react";

const Card = ({ image, industryName, date, role, aiName, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border border-white flex flex-col w-full relative max-w-96  gap-6 py-10 px-8 cursor-pointer"
    >
      <div className="w-full h-[230px] ">
        <img
          src="/assets/i-bot.png"
          alt=""
          className="w-[350px] h-[290px] object-cover absolute top-[-30px] right-[-30px]"
        />
      </div>
      <h2 className="text-2xl">{industryName}</h2>
      <div className="flex gap-3 items-center">
        <span className="text-base py-2 px-5 border border-white rounded-full">
          Sales Expert
        </span>
        <span
          className="text-base py-2 px-5  text-black  font-bold rounded-full "
          style={{
            background:
              "linear-gradient(70deg, rgba(48,69,201,1) 0%, rgba(101,190,218,1) 45%, rgba(154,211,127,1) 100%)",
          }}
        >
          Ai Name
        </span>
      </div>
    </div>
  );
};

export default Card;
