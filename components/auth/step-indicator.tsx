interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div className={`h-2 w-2 rounded-full ${index < currentStep ? "bg-primary" : "bg-gray-300"}`} />
          {index < totalSteps - 1 && (
            <div className={`h-0.5 w-4 ${index < currentStep - 1 ? "bg-primary" : "bg-gray-300"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

