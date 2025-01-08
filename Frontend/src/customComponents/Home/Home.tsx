import HomeBar from "./HomeBar";
import HomeContent from "./HomeContent";

const Home = () => {
  return (
    <div className="border min-h-screen flex  flex-col">
      <HomeBar />
      <HomeContent />
    </div>
  );
};

export default Home;
