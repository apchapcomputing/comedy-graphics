import ComedyFlyer, { Show } from "@/components/ComedyFlyer";
import DownloadButton from "@/components/DownloadButton";
import data from "../../data.json";

const Index = () => {
  // Load shows data from data.json
  const shows: Show[] = data.shows;

  return (
    <div className="min-h-screen bg-gradient-bg shadow-comedy flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <ComedyFlyer shows={shows} month={data.month} year={data.year} />
      </div>
    </div>
  );
};

export default Index;
