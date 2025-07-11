import React from 'react';
import Joyride, { Props as JoyrideProps, CallBackProps, Step } from 'react-joyride';

/**
 * Props for the AppTour component.
 * These are typically passed down from the useTour hook.
 */
interface AppTourProps {
  run: boolean; // Controls whether the tour is active.
  steps: Step[]; // Array of tour steps.
  stepIndex: number; // Current step index.
  handleJoyrideCallback: (data: CallBackProps) => void; // Callback for Joyride events.
  tourKey: number; // Key to force re-render Joyride, e.g., after navigation or step changes.
}

/**
 * AppTour component is a presentational component that renders the react-joyride tour.
 * It receives all necessary state and callbacks as props, typically from the `useTour` hook
 * (via a wrapper component like `TourProviderWrapper`).
 *
 * @param {AppTourProps} props - The props for configuring and controlling the tour.
 */
const AppTour: React.FC<AppTourProps> = ({
  run,
  steps,
  stepIndex,
  handleJoyrideCallback,
  tourKey,
}) => {
  const joyrideProps: JoyrideProps = {
    key: tourKey, // Crucial for re-rendering and re-evaluating targets after dynamic changes
    run,
    steps,
    stepIndex,
    continuous: true, // Go to next step on "Next" button click
    showProgress: true, // Show progress indicator (e.g., 2/5)
    showSkipButton: true, // Show skip button
    callback: handleJoyrideCallback,
    styles: {
      options: {
        arrowColor: '#007bff',
        backgroundColor: '#ffffff',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        primaryColor: '#007bff', // Used for buttons like "Next", "Finish"
        textColor: '#333333',
        zIndex: 10000,
      },
      buttonNext: {
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '4px',
        padding: '8px 16px',
      },
      buttonBack: {
        color: '#007bff',
        marginRight: 'auto', // Pushes it to the left
        borderRadius: '4px',
        padding: '8px 16px',
      },
      buttonSkip: {
        color: '#dc3545',
        borderRadius: '4px',
        padding: '8px 16px',
      },
      tooltip: {
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      },
    },
    locale: {
      back: 'Previous',
      close: 'Close',
      last: 'Finish',
      next: 'Next',
      skip: 'Skip Tour',
    }
  };

  return <Joyride {...joyrideProps} />;
};

export default AppTour;
