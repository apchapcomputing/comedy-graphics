import ComedyFlyer, { Show } from "@/components/ComedyFlyer";
import DownloadButton from "@/components/DownloadButton";

const Index = () => {
  // Test shows data - easily replaceable each month
  const shows: Show[] = [
    {
      type: "Improv Show",
      day: "Thursday",
      date: "October 2nd",
      time: "7pm",
      venue: "ComedyWorx",
      city: "Raleigh, NC",
      group: "Nerd Lens",
      logo: "comedyworx"
    },
    {
      type: "Stand Up Open Mic",
      day: "Friday",
      date: "October 10th",
      time: "8pm",
      venue: "Durty Bull Brewing",
      city: "Durham, NC",
      logo: "durty-bull"
    },
    {
      type: "Improv Show",
      day: "Saturday",
      date: "October 4th",
      time: "9pm",
      venue: "ComedyWorx",
      city: "Raleigh, NC",
      group: "Rat People",
      logo: "comedyworx"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <ComedyFlyer shows={shows} month="October" />

        {/* Download Button */}
        <div className="mt-6">
          <DownloadButton
            targetId="comedy-flyer"
            filename="october-comedy-shows"
          />
        </div>

      </div>
    </div>
  );
};

export default Index;
