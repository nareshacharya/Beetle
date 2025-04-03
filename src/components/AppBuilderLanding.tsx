import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function AppBuilderLanding() {
  const [appName, setAppName] = useState("");
  const [dxApiUrl, setDxApiUrl] = useState("");
  const [authMethod, setAuthMethod] = useState("");

  const handleGenerate = () => {
    alert(`App '${appName}' using DX API at '${dxApiUrl}' generated!`);
  };

  return (
    <div className="p-12 grid gap-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center flex items-center justify-center gap-2">
        <img src="/logo.svg" alt="Logo" className="" />
        Beetle
      </h1>
      <p className="font-medium text-center flex items-center justify-center gap-2">
        Building customized frontend for Pega applications
      </p>
      <Card>
        <CardContent className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium">
              Application Name
            </label>
            <Input
              placeholder="Enter app name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">DX API URL</label>
            <Input
              placeholder="https://your-pega-server/prweb/api/v1"
              value={dxApiUrl}
              onChange={(e) => setDxApiUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Auth Method</label>
            <Input
              placeholder="OAuth, Basic, etc."
              value={authMethod}
              onChange={(e) => setAuthMethod(e.target.value)}
            />
          </div>
          <Button
            onClick={handleGenerate}
            className="flex w-full justify-center rounded-md bg-zinc-600 px-3 py-2.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
          >
            Generate App
          </Button>
          <Link to="/builder" className="text-indigo-600 underline text-center">
            Go to Page Builder →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
