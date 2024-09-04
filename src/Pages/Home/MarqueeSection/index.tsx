import Marquee from "react-fast-marquee";

const MarqueeSection = () => {
  return (
    <div>
      <div className="flex flex-col">
        <div className="w-full h-[1px] bg-customTextGray max-w-[1500px] mx-auto"></div>
        <Marquee autoFill pauseOnHover direction="left" className="py-5 ">
          {[
            {
              text: "Revolutionizing the way you vote with blockchain powered technology",
            },
          ].map((item) => (
            <div
              key={crypto.randomUUID()}
              className="px-2 flex  items-center justify-center uppercase text-xs gap-4 text-customTextGray font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-customTextGray"></span>
              {item.text}
            </div>
          ))}
        </Marquee>
        <div className="w-full h-[1px] bg-customTextGray max-w-[1500px] mx-auto"></div>
      </div>
    </div>
  );
};

export default MarqueeSection;
