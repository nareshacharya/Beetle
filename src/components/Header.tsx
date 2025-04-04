import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-gray-900 text-white px-6 py-4 shadow-md flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo-light.svg" alt="Beetle Logo" className="w-6 h-6" />
        <h1 className="text-2xl font-bold tracking-wide">Beetle</h1>
      </Link>
    </header>
  );
}
