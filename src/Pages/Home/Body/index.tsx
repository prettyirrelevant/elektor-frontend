import Typewriter from "typewriter-effect";

const Body = () => {
  return (
    <div className="bg-bodyBackground w-full bg-no-repeat h-[80vh] bg-center flex justify-center">
      <div className="text-center">
        <div className="pt-32 text-4xl text-customTextGray2 font-bold text-center">
          EXPERIENCE THE FUTURE OF ELECTIONS
        </div>
        <div className="text-white text-3xl flex items-center justify-center font-bold pt-5 gap-2">
          <span>-</span>
          <Typewriter
            options={{
              strings: ["TAMPER-PROOF", "RELIABLE", "TRANSPARENT", "PRIVATE", "VERIFIABLE"],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Body;
