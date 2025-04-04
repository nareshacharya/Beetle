import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ArrowLeft, ArrowRight } from "lucide-react";

interface Step {
  id: number;
  name: string;
}

interface Stage {
  id: number;
  name: string;
  steps: Step[];
}

export default function StageStepBuilder({
  appInfo,
  onBack,
}: {
  appInfo: any;
  onBack: () => void;
}) {
  const [stages, setStages] = useState<Stage[]>([]);
  const [stageName, setStageName] = useState("");
  const [stepName, setStepName] = useState("");
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [nextStageId, setNextStageId] = useState(1);
  const [nextStepId, setNextStepId] = useState(1);
  const [exportedJson, setExportedJson] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("stage-structure", JSON.stringify(stages));
  }, [stages]);

  const addStage = () => {
    if (!stageName.trim()) return;
    const newStage: Stage = {
      id: nextStageId,
      name: stageName.trim(),
      steps: [],
    };
    setStages([...stages, newStage]);
    setNextStageId(nextStageId + 1);
    setStageName("");
  };

  const addStepToStage = () => {
    if (!stepName.trim() || selectedStageId === null) return;
    const updatedStages = stages.map((stage) => {
      if (stage.id === selectedStageId) {
        return {
          ...stage,
          steps: [...stage.steps, { id: nextStepId, name: stepName.trim() }],
        };
      }
      return stage;
    });
    setStages(updatedStages);
    setNextStepId(nextStepId + 1);
    setStepName("");
  };

  const handleStepClick = (stepId: number) => {
    const selectedStage = stages.find((stage) =>
      stage.steps.some((step) => step.id === stepId)
    );
    const selectedStep = selectedStage?.steps.find(
      (step) => step.id === stepId
    );
    if (selectedStage && selectedStep) {
      navigate(`/builder/${stepId}`, {
        state: {
          appInfo,
          stage: selectedStage,
          step: selectedStep,
        },
      });
    }
  };

  const handleExport = () => {
    const structure = JSON.stringify(stages, null, 2);
    setExportedJson(structure);
    const blob = new Blob([structure], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stages-structure.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="max-w-4xl mx-auto mt-10 px-4">
        <Card>
          <CardContent className="space-y-6 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Configure Stages & Steps
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-1" /> Export JSON
                </Button>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Add a new stage
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Stage Name"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                />
                <Button onClick={addStage}>Add Stage</Button>
              </div>
            </div>

            <div className="space-y-6">
              {stages.map((stage) => (
                <div key={stage.id} className="border rounded p-4 bg-gray-50">
                  <h3 className="font-semibold mb-2">{stage.name}</h3>
                  {stage.steps.length === 0 ? (
                    <p className="text-sm text-gray-500">No steps added yet.</p>
                  ) : (
                    <ul className="list-disc ml-6">
                      {stage.steps.map((step) => (
                        <li
                          key={step.id}
                          className="cursor-pointer text-blue-600 hover:underline"
                          onClick={() => handleStepClick(step.id)}
                        >
                          {step.name}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4">
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                      Add a step to this stage
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Step Name"
                        value={selectedStageId === stage.id ? stepName : ""}
                        onChange={(e) => {
                          setSelectedStageId(stage.id);
                          setStepName(e.target.value);
                        }}
                      />
                      <Button onClick={addStepToStage}>Add Step</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {stages.some((stage) => stage.steps.length > 0) && (
              <div className="flex justify-end pt-6">
                <Button
                  onClick={() => {
                    const firstStage = stages.find((s) => s.steps.length > 0);
                    if (firstStage) {
                      const firstStep = firstStage.steps[0];
                      navigate(`/builder/${firstStep.id}`, {
                        state: {
                          appInfo,
                          stage: firstStage,
                          step: firstStep,
                        },
                      });
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
