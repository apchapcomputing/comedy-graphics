import { Card } from "@/components/ui/card";
import alchemyLogo from "@/assets/alchemy-logo.png";
import blackSheepLogo from "@/assets/black-sheep-logo.png"
import comedyWorxLogo from "@/assets/comedyworx-logo.png";
import durtyBullLogo from "@/assets/durty-bull-logo.png";
import grfcLogo from "@/assets/robot.png";
import kingsLogo from "@/assets/kings.png";
import lastWordLogo from "@/assets/last-word-logo.png";
import mettlesomeLogo from "@/assets/mettlesome-logo.png"
import defaultLogo from "@/assets/default-logo.png";

export interface Show {
  type: string;
  day: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  group?: string;
  character?: string;
  logo?: string;
  details?: string;
}

interface ComedyFlyerProps {
  shows: Show[];
  month: string;
  year: string;
  isFiltered?: boolean;
}

const ComedyFlyer = ({ shows, month, year, isFiltered = false }: ComedyFlyerProps) => {
  const getVenueLogo = (show: Show) => {
    const typeLower = show.type.toLowerCase().trim();

    // Check for Giant Robot Fight Club first
    if (typeLower.includes('giant robot fight club')) {
      return grfcLogo;
    }

    const venueLower = show.venue.toLowerCase().trim();

    switch (true) {
      case venueLower.includes('alchemy'):
        return alchemyLogo;
      case venueLower.includes('muses') || venueLower.includes('black sheep') || venueLower.includes('arts center'):
        return blackSheepLogo;
      case venueLower.includes('comedyworx'):
        return comedyWorxLogo;
      case venueLower.includes('durty bull') || venueLower.includes('durty-bull'):
        return durtyBullLogo;
      case venueLower.includes('kings'):
        return kingsLogo;
      case venueLower.includes('mettlesome'):
        return mettlesomeLogo;
      case venueLower.includes('phi'):
        return lastWordLogo;
      default:
        return defaultLogo;
    }
  };


  const getShowTypeStyle = (type: string) => {
    if (type.toLowerCase().includes('improv')) {
      return 'bg-gradient-improv text-white';
    }
    if (type.toLowerCase().includes('stand') || type.toLowerCase().includes('open mic')) {
      return 'bg-gradient-standup text-white';
    }
    if (type.toLowerCase().includes('music') || type.toLowerCase().includes('concert')) {
      return 'bg-gradient-music text-white';
    }
    return 'bg-gradient-fun text-white';
  };

  return (
    <Card
      id="comedy-flyer"
      className="w-full max-w-[500px] h-full p-4 sm:p-6 border-0 relative bg-inherit"
    >

      {/* Header */}
      <div className="relative z-10 text-center mb-4 sm:mb-6">
        <h1 className="font-sans font-bold text-2xl sm:text-3xl text-foreground mb-2">
          ASHLYN ON STAGE
        </h1>
        <h2 className="font-caveat text-xl sm:text-2xl text-foreground font-bold">
          {isFiltered ? `${month} ${year}` : 'Upcoming Shows'}
        </h2>
        <div className="w-16 sm:w-20 h-1 bg-comedy-red mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Shows List */}
      <div className="relative z-10 space-y-2 sm:space-y-3">
        {shows.map((show, index) => (
          <div
            key={index}
            className={`p-3 sm:p-4 rounded-lg ${getShowTypeStyle(show.type)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                {show.details && (
                  <div className="flex mb-1">
                    <span className="font-caveat text-lg sm:text-xl font-extrabold uppercase tracking-wider">
                      {show.details}
                    </span>
                  </div>
                )}
                <div className="flex items-center mb-1 space-x-1 sm:space-x-2 flex-wrap">
                  <span className="font-caveat text-sm sm:text-base font-bold uppercase tracking-wide leading-none">
                    {show.type}
                  </span>
                  {show.group && (
                    <span className="font-mono font-light text-[10px] sm:text-xs bg-foreground/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      with {show.group}
                    </span>
                  )}
                  {show.character && (
                    <span className="font-mono font-light text-[10px] sm:text-xs bg-foreground/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      as {show.character}
                    </span>
                  )}
                </div>
                <div className="font-comic text-base sm:text-lg font-bold flex items-baseline flex-wrap">
                  <span>{show.day}, {show.date}</span>
                  {show.time && <span className="font-normal mx-1">at</span>}
                  <span>{show.time}</span>
                </div>
                <div className="font-mono flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-wrap">
                  {show.venue && (
                    <span className="truncate">{show.venue}</span>
                  )}
                  {show.venue && (
                    <span>•</span>
                  )}
                  {show.city && (
                    <span className="font-light">{show.city}</span>
                  )}
                </div>
              </div>

              {/* Venue Logo */}
              {getVenueLogo(show) && (
                <div className={`w-14 h-10 sm:w-20 sm:h-14 bg-white rounded-full flex items-center justify-center ml-2 sm:ml-3 overflow-hidden flex-shrink-0 ${show.type.toLowerCase().includes('giant robot fight club') ? '' : 'p-1'}`}>
                  <img
                    src={getVenueLogo(show)}
                    alt={`${show.venue} logo`}
                    className={`w-full h-full ${show.type.toLowerCase().includes('giant robot fight club') ? 'object-cover' : 'object-contain'}`}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="text-center pt-2">
          <div className="font-sans flex justify-center space-x-4 text-[10px] sm:text-xs text-foreground/70">
            <span>@ashlynchaps</span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
        <div className="w-2 sm:w-3 h-2 sm:h-3 bg-comedy-blue rounded-full"></div>
      </div>
      <div className="absolute top-8 sm:top-12 right-6 sm:right-8 z-10">
        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-comedy-red rounded-full"></div>
      </div>
    </Card>
  );
};

export default ComedyFlyer;