import { useState, useEffect, useCallback } from 'react';
import { CallBackProps, Step, EVENTS, ACTIONS, STATUS } from 'react-joyride';
import { useNavigate } from 'react-router-dom';

/**
 * Interface for the tour state managed by the useTour hook.
 */
export interface TourState {
  run: boolean; // Controls whether the tour is active and visible.
  steps: Step[]; // Defines the steps of the tour.
  stepIndex: number; // The index of the currently active tour step.
  tourKey: number; // A key to force re-rendering of the Joyride component, useful after dynamic changes like navigation.
}

/**
 * Initial steps for the application tour.
 * Each step targets a specific element and provides content.
 * The `navigateTo` custom property is used by the hook to handle routing.
 * `disableBeacon: true` on the first step prevents the beacon from appearing before the tour starts.
 */
const INITIAL_STEPS: Step[] = [
  {
    target: '[data-tour="navbar"]',
    content: 'This is the main navigation bar. You can use it to move between different sections of the application.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="navbar-dashboard"]',
    content: 'Click here to go to your Dashboard.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="navbar-profile"]',
    content: 'Click here to view your Profile.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="navbar-settings"]',
    content: 'Click here to manage your Settings.',
    placement: 'bottom',
  },
  // Dashboard Page Steps
  {
    target: '[data-tour="dashboard-title"]',
    content: 'Welcome to the Dashboard! This is where you get an overview of your activities.',
    placement: 'bottom',
    // Custom property to indicate navigation
    navigateTo: '/',
  },
  {
    target: '[data-tour="dashboard-content"]',
    content: 'This area shows key information and summaries.',
    placement: 'top',
  },
  // Profile Page Steps
  {
    target: '[data-tour="profile-title"]',
    content: 'This is your Profile page.',
    placement: 'bottom',
    navigateTo: '/profile',
  },
  {
    target: '[data-tour="profile-content"]',
    content: 'Here you can view and edit your personal information.',
    placement: 'top',
  },
  // Settings Page Steps
  {
    target: '[data-tour="settings-title"]',
    content: 'This is the Settings page.',
    placement: 'bottom',
    navigateTo: '/settings',
  },
  {
    target: '[data-tour="settings-content"]',
    content: 'Configure application preferences and settings here.',
    placement: 'top',
  },
  {
    target: 'body',
    content: 'You have completed the tour! Feel free to explore the application.',
    placement: 'center',
    navigateTo: '/', // Navigate back to dashboard at the end
  },
];

/**
 * Custom hook to manage the state and logic of the application tour.
 * @param {Step[]} initialSteps - Optional array of steps to override the default initial steps.
 * @returns {object} The tour state and functions to control the tour.
 */
export const useTour = (initialSteps: Step[] = INITIAL_STEPS) => {
  const navigate = useNavigate();
  const [tourState, setTourState] = useState<TourState>({
    run: false, // Tour does not run by default
    steps: initialSteps, // Initial set of steps for the tour
    stepIndex: 0, // Start at the first step
    tourKey: Date.now(), // Unique key for Joyride component re-rendering
  });

  const { run, steps, stepIndex } = tourState;

  /**
   * Handles programmatic navigation required by tour steps.
   * It pauses the tour, navigates, and then resumes the tour after a short delay
   * to allow the new page/components to render.
   * @param {string} navigateToPath - The path to navigate to.
   */
  const handleNavigation = useCallback((navigateToPath: string) => {
    if (window.location.pathname !== navigateToPath) {
      setTourState(prev => ({ ...prev, run: false })); // Pause tour before navigating
      navigate(navigateToPath);
      // Resume tour after a delay to ensure the page has loaded and targets are available
      setTimeout(() => {
        // Update tourKey to force Joyride to re-evaluate and find new targets
        setTourState(prev => ({ ...prev, run: true, tourKey: Date.now() }));
      }, 500); // Delay may need adjustment based on app's loading behavior
    }
  }, [navigate]);

  /**
   * useEffect hook to trigger navigation when a step with `navigateTo` is reached.
   */
  useEffect(() => {
    if (run && steps[stepIndex]) {
      const currentStep = steps[stepIndex];
      // The `navigateTo` property is a custom addition to the Step object
      if ((currentStep as any).navigateTo) {
        handleNavigation((currentStep as any).navigateTo);
      }
    }
  }, [run, stepIndex, steps, handleNavigation]);

  /**
   * Starts or restarts the tour.
   * @param {Step[]} startSteps - Optional array of steps to use for this tour run. Defaults to initialSteps.
   */
  const startTour = useCallback((startSteps: Step[] = initialSteps) => {
    const effectiveSteps = startSteps.length > 0 ? startSteps : INITIAL_STEPS;
    // Note: `localStorage.removeItem('tourViewed');` was here for testing, removed for production.

    setTourState({
      run: false, // Set to false initially; will be set to true by navigation or directly below
      steps: effectiveSteps,
      stepIndex: 0,
      tourKey: Date.now(),
    });

    // Handle navigation for the very first step if needed
    const firstStep = effectiveSteps[0];
    if ((firstStep as any).navigateTo && window.location.pathname !== (firstStep as any).navigateTo) {
        handleNavigation((firstStep as any).navigateTo);
    } else {
        // If no navigation needed for the first step, start the tour directly
        setTourState(prev => ({...prev, run: true}));
    }

  }, [initialSteps, handleNavigation]);

  /**
   * Callback function for react-joyride. Handles tour events like step changes,
   * tour completion, or skipping.
   * @param {CallBackProps} data - The callback data from react-joyride.
   */
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    // console.log('Joyride callback data:', data); // Useful for debugging

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      // Tour finished or skipped by the user
      setTourState(prev => ({ ...prev, run: false, stepIndex: 0 }));
      localStorage.setItem('tourViewed', 'true'); // Mark tour as viewed
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // After a step is shown or if a target isn't found
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (action === ACTIONS.CLOSE) {
        // Tour closed by the user (e.g., clicking the 'X' on the tooltip)
        setTourState(prev => ({ ...prev, run: false }));
        localStorage.setItem('tourViewed', 'true'); // Mark tour as viewed
      } else {
        // Advance to the next or previous step
        // Navigation for the next step is handled by the useEffect hook
        setTourState(prev => ({ ...prev, stepIndex: nextStepIndex, run: true }));
      }
    }
  };

  /**
   * Adds new steps to the existing tour steps.
   * @param {Step[]} newSteps - Array of new steps to add.
   */
  const addSteps = (newSteps: Step[]) => {
    setTourState(prev => ({
      ...prev,
      steps: prev.steps.concat(newSteps), // Ensure immutability
      tourKey: Date.now(), // Update key to reflect step changes if tour is running
    }));
  };

  /**
   * Manually sets the run state of the tour.
   * @param {boolean} isRunning - Whether the tour should be running.
   */
  const setRun = (isRunning: boolean) => {
    setTourState(prev => ({ ...prev, run: isRunning }));
  };

  // Expose tour state and control functions
  return {
    run: tourState.run,
    steps: tourState.steps,
    stepIndex: tourState.stepIndex,
    tourKey: tourState.tourKey,
    startTour,
    handleJoyrideCallback,
    addSteps,
    setRun,
    setSteps: (newSteps: Step[]) => setTourState(prev => ({ ...prev, steps: newSteps, tourKey: Date.now() })),
  };
};
