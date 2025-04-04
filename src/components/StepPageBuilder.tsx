import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import PageBuilder from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import {
  TextCursorInput,
  SquareCode,
  PanelTopClose,
  List,
  Quote,
  Video,
  LinkIcon,
  MousePointerClick,
  Text,
  FileText,
} from "lucide-react";

export default function StepPageBuilder() {
  const { stepId } = useParams();
  const { state } = useLocation();
  const { appInfo, stage, step } = state || {};
  const [exportedJson, setExportedJson] = useState(null);
  const navigate = useNavigate();

  const handleExport = () => {
    const designedComponents = localStorage.getItem(`step-ui-${stepId}`);
    const exportData = {
      appInfo,
      stage,
      step,
      layout: designedComponents ? JSON.parse(designedComponents) : [],
      timestamp: new Date().toISOString(),
    };
    setExportedJson(exportData);
  };

  const draggableComponents = [
    {
      type: "input",
      label: "Input",
      icon: <TextCursorInput className="w-5 h-5" />,
    },
    { type: "card", label: "Card", icon: <SquareCode className="w-5 h-5" /> },
    {
      type: "heading",
      label: "Heading",
      icon: <PanelTopClose className="w-5 h-5" />,
    },
    { type: "list", label: "List", icon: <List className="w-5 h-5" /> },
    { type: "quote", label: "Quote", icon: <Quote className="w-5 h-5" /> },
    { type: "video", label: "Video", icon: <Video className="w-5 h-5" /> },
    { type: "link", label: "Link", icon: <LinkIcon className="w-5 h-5" /> },
    {
      type: "button",
      label: "Button",
      icon: <MousePointerClick className="w-5 h-5" />,
    },
    { type: "text", label: "Text", icon: <Text className="w-5 h-5" /> },
    {
      type: "richtext",
      label: "Rich Text",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  const getLabelForType = (type) => {
    const item = draggableComponents.find((c) => c.type === type);
    return item?.label || "Unknown";
  };

  if (!step) return <p className="p-4 text-red-500">No step data found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="flex max-w-7xl mx-auto mt-6 gap-4 px-4">
        <aside className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Components</h3>
            <p className="text-sm text-gray-400">Drag to the right panel</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {draggableComponents.map((comp) => (
              <div
                key={comp.type}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("component/type", comp.type)
                }
                className="bg-gray-800 p-3 rounded flex flex-col items-center text-xs text-gray-200 hover:bg-gray-700 cursor-move"
              >
                {comp.icon}
                <span>{comp.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Design Step UI</h2>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>App:</strong> {appInfo?.appName}
                </p>
                <p>
                  <strong>Stage:</strong> {stage?.name}
                </p>
                <p>
                  <strong>Step:</strong> {step?.name} (ID: {stepId})
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Steps
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" /> Export JSON
              </Button>
            </div>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const type = e.dataTransfer.getData("component/type");
              const label = getLabelForType(type);
              const pageBuilder = document.querySelector(
                "[data-pb-target='true']"
              ) as any;
              if (pageBuilder && pageBuilder.addComponent) {
                pageBuilder.addComponent(type, label);
              }
            }}
          >
            <PageBuilder stepId={stepId} />
          </div>

          {exportedJson && (
            <div className="bg-white border rounded p-4 shadow">
              <h3 className="text-lg font-semibold mb-2">Exported JSON</h3>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
                {JSON.stringify(exportedJson, null, 2)}
              </pre>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
