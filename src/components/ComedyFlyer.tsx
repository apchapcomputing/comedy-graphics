import { Card } from "@/components/ui/card";
import durtyBullLogo from "@/assets/durty-bull-logo.png";
import comedyWorxLogo from "@/assets/comedyworx-logo.png";

export interface Show {
  type: string;
  day: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  group?: string;
  logo: string;
}

interface ComedyFlyerProps {
  shows: Show[];
  month: string;
}

const ComedyFlyer = ({ shows, month }: ComedyFlyerProps) => {
  const getVenueLogo = (venue: string) => {
    const venueLower = venue.toLowerCase().trim();
    if (venueLower.includes('comedyworx')) {
      return comedyWorxLogo;
    }
    if (venueLower.includes('durty bull') || venueLower.includes('durty-bull')) {
      return durtyBullLogo;
    }
    return '';
  };

  const getShowTypeStyle = (type: string) => {
    if (type.toLowerCase().includes('improv')) {
      return 'bg-gradient-energy text-white';
    }
    if (type.toLowerCase().includes('stand up') || type.toLowerCase().includes('open mic')) {
      return 'bg-gradient-fun text-white';
    }
    return 'bg-gradient-comedy text-foreground';
  };

  return (
    <Card
      id="comedy-flyer"
      className="w-[500px] h-[500px] p-6 bg-gradient-comedy shadow-comedy border-0 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-comedy-purple rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-comedy-red rounded-full transform -translate-x-12 translate-y-12"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-6">
        <h1 className="font-bold text-3xl text-foreground mb-2">
          ASHLYN'S COMEDY SHOWS
        </h1>
        <h2 className="font-comic text-xl text-foreground font-bold">
          {month} 2025
        </h2>
        <div className="w-20 h-1 bg-comedy-red mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Shows List */}
      <div className="relative z-10 space-y-3">
        {shows.map((show, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${getShowTypeStyle(show.type)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
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
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-6 right-6 z-10">
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