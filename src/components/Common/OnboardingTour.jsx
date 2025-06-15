import React from 'react';
import './OnboardingTour.css';

const OnboardingTour = ({ onComplete }) => {
  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <h2>Welcome to Expense Tracker!</h2>
        <p>
          Track your expenses, set savings goals, and manage your finances with ease. 
          Your data stays private and secure on your device.
        </p>
        <button onClick={onComplete} className="onboarding-btn">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default OnboardingTour;