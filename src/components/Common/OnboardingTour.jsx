// src/components/Common/OnboardingTour.jsx
import React, { useState } from 'react';
import './OnboardingTour.css';

const OnboardingTour = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Expense Tracker!",
      content: "Track your expenses, set budgets, and manage your finances with ease. Your data stays private and secure on your device.",
      icon: "👋"
    },
    {
      title: "Add Your First Expense",
      content: "Click the 'Add Expense' button to log your spending. You can also scan receipts or create recurring expenses.",
      icon: "💰"
    },
    {
      title: "Set Monthly Budgets",
      content: "Create budgets for different categories to track your spending limits and stay on target.",
      icon: "🎯"
    },
    {
      title: "Plan for the Future",
      content: "Add planned expenses and savings goals to better manage your financial future.",
      icon: "📅"
    },
    {
      title: "Your Data is Safe",
      content: "Everything is stored locally on your device. Use the Import/Export feature to backup your data.",
      icon: "🔒"
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-header">
          <div className="step-indicator">
            Step {currentStep + 1} of {steps.length}
          </div>
          <button onClick={handleSkip} className="skip-btn">Skip Tour</button>
        </div>
        
        <div className="onboarding-content">
          <div className="step-icon">{currentStepData.icon}</div>
          <h2>{currentStepData.title}</h2>
          <p>{currentStepData.content}</p>
        </div>

        <div className="onboarding-actions">
          {currentStep > 0 && (
            <button onClick={handlePrevious} className="btn-secondary">
              Previous
            </button>
          )}
          <button onClick={handleNext} className="btn-primary">
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
          </button>
        </div>

        <div className="progress-dots">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`dot ${index === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;