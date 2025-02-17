import React, { useState } from 'react';

import RegSidebar from './SignupWizard/RegSidebar';
import Guardian from './SignupWizard/Guardian';
import AddStudent from './SignupWizard/AddStudent';
import Final from './SignupWizard/Final';

const RegisterationWiz = () => {
  const [activeStep, setActiveStep] = useState(1);

  const handlePrevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handleNextStep = () => {
    if (activeStep < 5) setActiveStep(activeStep + 1);
  };

  const renderSteps = () => {
    switch (activeStep) {
      case 1:
        return <Guardian activeStep={activeStep} prevStep={handlePrevStep} nextStep={handleNextStep} />;
      case 2:
        return <AddStudent activeStep={activeStep} prevStep={handlePrevStep} nextStep={handleNextStep} />;
      case 3:
        return <Final activeStep={activeStep} prevStep={handlePrevStep} nextStep={handleNextStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden md:block md:w-1/3 lg:w-1.5/4 sticky top-0">
        <RegSidebar activeStep={activeStep} prevStep={handlePrevStep} nextStep={handleNextStep} />
      </div>

      {/* Scrollable Main Content */}
      <div className="w-full md:w-2/3 lg:w-3/4 h-screen overflow-y-auto p-4">
        {renderSteps()}
      </div>
    </div>
  );
};

export default RegisterationWiz;
