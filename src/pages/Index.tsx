import ComedyFlyer, { Show } from "@/components/ComedyFlyer";
import DownloadButton from "@/components/DownloadButton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import data from "../../data.json";

const Index = () => {
  // Load shows data from data.json
  const shows: Show[] = data.shows;
  const [filterByMonth, setFilterByMonth] = useState(false);

  // Filter shows by month if toggle is enabled
  const filteredShows = filterByMonth
    ? shows.filter(show => show.date.toLowerCase().includes(data.month.toLowerCase()))
    : shows;

  return (
    <div className="min-h-screen bg-gradient-bg shadow-comedy flex items-center justify-center p-2 sm:p-4">
      {/* Toggle Filter in Top Right */}
      <div className="fixed top-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <Switch
            id="month-filter"
            checked={filterByMonth}
            onCheckedChange={setFilterByMonth}
          />
          <Label
            htmlFor="month-filter"
            className="text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap"
          >
            This month
          </Label>
        </div>
      </div>

      <div className="text-center space-y-8 w-full max-w-[500px]">
        <ComedyFlyer
          shows={filteredShows}
          month={data.month}
          year={data.year}
          isFiltered={filterByMonth}
        />
        {/* <DownloadButton targetId="comedy-flyer" filename="comedy-flyer" /> */}
      </div>
    </div>
  );
};

export default Index;
