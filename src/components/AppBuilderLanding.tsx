import { Button } from "@/components/ui/button";

export default function AppBuilderLanding({
  onStart,
}: {
  onStart: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none animate-fade-in-slow">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 800 600"
        >
          <g fill="#1e90ff" fillOpacity="0.15">
            <circle cx="500" cy="350" r="300" className="animate-slow-pulse" />
            <circle cx="250" cy="200" r="120" className="animate-slow-pulse" />
            <circle cx="650" cy="450" r="180" className="animate-slow-pulse" />
          </g>
        </svg>
      </div>

      <div className="max-w-3xl text-center space-y-8 relative z-10 animate-slide-up">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4 animate-zoom-in">
            <img
              src="/logo-light.svg"
              alt="Beetle Logo"
              className="w-20 h-20 animate-bounce"
            />
            <h1 className="text-8xl md:text-8xl py-8 font-extrabold tracking-tight animate-flip-up">
              Beetle
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-xl mx-auto animate-fade-up delay-300">
            Quickly design beautiful, custom frontends for your Pega
            applications with full DX API and Constellation compatibility.
          </p>
        </div>

        <Button
          className="text-lg px-8 py-6 bg-white text-gray-900 font-semibold rounded shadow-md hover:bg-gray-100 hover:scale-105 transform transition-transform duration-300 ease-in-out animate-glow"
          onClick={onStart}
        >
          Start Building
        </Button>
      </div>
    </div>
  );
}
