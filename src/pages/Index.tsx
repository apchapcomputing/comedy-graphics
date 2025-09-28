import ComedyFlyer, { Show } from "@/components/ComedyFlyer";

const Index = () => {
  // Test shows data - easily replaceable each month
  const shows: Show[] = [
    {
      type: "Improv Show",
      day: "Thursday",
      date: "October 2nd",
      time: "7pm",
      venue: "ComedyWorx",
      group: "Nerd Lens",
      logo: "comedyworx"
    },
    {
      type: "Stand Up Open Mic", 
      day: "Friday",
      date: "October 10th",
      time: "8pm",
      venue: "Durty Bull",
      logo: "durty-bull"
    },
    {
      type: "Improv Show",
      day: "Saturday", 
      date: "October 4th",
      time: "9pm",
      venue: "ComedyWorx",
      group: "Rat People",
      logo: "comedyworx"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <ComedyFlyer shows={shows} month="October" />
        
        {/* Instructions for updating */}
        <div className="mt-8 max-w-md mx-auto text-left bg-card p-6 rounded-lg shadow-fun">
          <h3 className="font-bold text-lg mb-3 text-comedy-purple">How to Update Monthly:</h3>
          <ol className="text-sm space-y-2 text-muted-foreground">
            <li>1. Update the <code>shows</code> array with new show information</li>
            <li>2. Change the <code>month</code> prop in the ComedyFlyer component</li>
            <li>3. Add venue logos to the assets folder if needed</li>
            <li>4. The flyer will automatically resize and style the content</li>
          </ol>
          <p className="text-xs mt-4 text-muted-foreground">
            Perfect square format for social media sharing!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
