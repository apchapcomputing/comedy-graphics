import { Card } from "@/components/ui/card";
import alchemyLogo from "@/assets/alchemy-logo.png";
import comedyWorxLogo from "@/assets/comedyworx-logo.png";
import durtyBullLogo from "@/assets/durty-bull-logo.png";
import mettlesomeLogo from "@/assets/mettlesome-logo.png"
import defaultLogo from "@/assets/default-logo.png";
import festivalIcon from "@/assets/festival-icon.png";

export interface Show {
  type: string;
  day: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  group?: string;
  logo: string;
  details?: string;
}

interface ComedyFlyerProps {
  shows: Show[];
  month: string;
  year: string;
}

const ComedyFlyer = ({ shows, month, year }: ComedyFlyerProps) => {
  const getVenueLogo = (venue: string) => {
    const venueLower = venue.toLowerCase().trim();

    switch (true) {
      case venueLower.includes('alchemy'):
        return alchemyLogo;
      case venueLower.includes('comedyworx'):
        return comedyWorxLogo;
      case venueLower.includes('durty bull') || venueLower.includes('durty-bull'):
        return durtyBullLogo;
      case venueLower.includes('mettlesome'):
        return mettlesomeLogo;
      default:
        return defaultLogo;
    }
  };


  const getShowTypeStyle = (type: string) => {
    if (type.toLowerCase().includes('improv')) {
      return 'bg-gradient-energy text-white';
    }
    if (type.toLowerCase().includes('stand') || type.toLowerCase().includes('open mic')) {
      return 'bg-gradient-fun text-white';
    }
    return 'bg-gradient-comedy text-foreground';
  };

  return (
    <Card
      id="comedy-flyer"
      className="w-[500px] h-[500px] p-6 border-0 relative bg-inherit"
    >

      {/* Header */}
      <div className="relative z-10 text-center mb-6">
        <h1 className="font-bold text-3xl text-foreground mb-2">
          ASHLYN'S COMEDY SHOWS
        </h1>
        <h2 className="font-comic text-xl text-foreground font-bold">
          {month} {year}
        </h2>
        <div className="w-20 h-1 bg-comedy-red mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Shows List */}
      <div className="relative z-10 space-y-3">
        {shows.map((show, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${getShowTypeStyle(show.type)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {show.details && (
                  <div className="flex mb-1">
                    <span className="font-comic text-xl font-extrabold uppercase tracking-wider">
                      {show.details}
                    </span>
                  </div>
                )}
                <div className="flex items-center mb-1 space-x-2">
                  <span className="font-comic text-sm font-bold uppercase tracking-wide">
                    {show.type}
                  </span>
                  {show.group && (
                    <span className="text-xs bg-foreground/10 px-2 py-1 rounded-full">
                      with {show.group}
                    </span>
                  )}
                </div>
                <div className="font-comic text-lg font-bold flex items-baseline">
                  <span>{show.day}, {show.date}</span>
                  <span className="font-normal mx-1">at</span>
                  <span>{show.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>{show.venue}</span>
                  <span>•</span>
                  <span>{show.city}</span>
                </div>
              </div>

              {/* Venue Logo */}
              {getVenueLogo(show.venue) && (
                <div className="w-14 h-14 bg-white rounded-full p-2 flex items-center justify-center ml-3">
                  <img
                    src={getVenueLogo(show.venue)}
                    alt={`${show.venue} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="text-center">
          <div className="flex justify-center space-x-4 text-xs text-foreground/70">
            <span>@apchapcomedy</span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-6 right-6 z-10">
        <div className="w-3 h-3 bg-comedy-blue rounded-full"></div>
      </div>
      <div className="absolute top-12 right-8 z-10">
        <div className="w-2 h-2 bg-comedy-red rounded-full"></div>
      </div>
    </Card>
  );
};

export default ComedyFlyer;