import { useState } from "react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BasicInfoForm({
  onNext,
}: {
  onNext: (data: any) => void;
}) {
  const [appName, setAppName] = useState("");
  const [appId, setAppId] = useState("");
  const [caseType, setCaseType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName || !appId || !caseType) return;
    onNext({ appName, appId, caseType });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="max-w-xl mx-auto mt-10 px-4">
        <Card>
          <CardContent className="space-y-6 p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Pega App Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Application Name
                </label>
                <Input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Enter your application name"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Application ID
                </label>
                <Input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="Enter application ID"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Case Type
                </label>
                <Input
                  type="text"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  placeholder="Enter case type"
                />
              </div>
              <Button type="submit" className="w-full mt-4">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
