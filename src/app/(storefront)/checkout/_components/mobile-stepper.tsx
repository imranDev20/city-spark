interface MobileStepperProps {
  currentStep: number;
  totalSteps: number;
  nextStep: string;
}

const MobileStepper: React.FC<MobileStepperProps> = ({
  currentStep,
  totalSteps,
  nextStep,
}) => {
  const progress = (currentStep / totalSteps) * 100;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="lg:hidden p-4 bg-white border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="#E5E7EB"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-primary"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
              <text
                x="50%"
                y="50%"
                dy=".3em"
                textAnchor="middle"
                className="text-sm font-medium"
                transform="rotate(90 32 32)"
              >
                {currentStep} of {totalSteps}
              </text>
            </svg>
          </div>

          <div>
            <p className="text-sm text-gray-500">Next</p>
            <h2 className="font-medium text-gray-900">{nextStep}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileStepper;
