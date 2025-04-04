import { useState } from "react";
import BasicInfoForm from "./BasicInfoForm";
import StageStepBuilder from "./StageStepBuilder"; // placeholder

export default function StageFlowRouter() {
  const [stage, setStage] = useState(1);
  const [appInfo, setAppInfo] = useState(null);

  const handleBasicInfoSubmit = (data: any) => {
    setAppInfo(data);
    setStage(2);
  };

  return (
    <div>
      {stage === 1 && <BasicInfoForm onNext={handleBasicInfoSubmit} />}
      {stage === 2 && (
        <StageStepBuilder appInfo={appInfo} onBack={() => setStage(1)} />
      )}
    </div>
  );
}
