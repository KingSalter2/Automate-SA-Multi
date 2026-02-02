import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import heroImage from "@/assets/hero-car.jpg";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans selection:bg-white/20">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Background"
          className="h-full w-full object-cover opacity-40 scale-105 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
      </div>

      {/* Massive 404 Background Text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
        <h1 className="text-[25rem] md:text-[35rem] lg:text-[45rem] font-black leading-none tracking-tighter text-white/5 select-none transform translate-y-10">
          404
        </h1>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700 slide-in-from-bottom-10">
        <div className="space-y-8 max-w-3xl mx-auto backdrop-blur-md bg-black/20 p-12 rounded-3xl border border-white/10 shadow-2xl">
            <div className="space-y-4">
                <p className="text-sm font-bold tracking-[0.2em] text-zinc-400 uppercase">Page Not Found</p>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
                I think you are lost.
                </h2>
            </div>
            
            <p className="text-zinc-300 text-xl md:text-2xl leading-relaxed max-w-xl mx-auto drop-shadow-md">
            The page you are looking for seems to have driven off into the sunset without us.
            </p>
            
            <div className="pt-6">
                <Button 
                asChild 
                size="lg"
                className="bg-white text-black hover:bg-zinc-200 hover:scale-105 font-bold text-lg h-14 px-10 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                <Link to="/" className="flex items-center gap-2">
                    <MoveLeft className="w-5 h-5" />
                    Return Home
                </Link>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
