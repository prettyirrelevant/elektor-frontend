import Body from './Body';
import Header from './Header';
import MarqueeSection from './MarqueeSection';
import Watermark from './Watermark';

const Home = () => {
  return (
    <div className="bg-black w-full  text-white">
      <div className="max-w-[1600px] mx-auto">
        <Header />
        <MarqueeSection />
        <Body />
        <Watermark />
      </div>
    </div>
  );
};

export default Home;
