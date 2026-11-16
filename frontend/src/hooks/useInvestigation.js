import { useCallback, useState } from 'react';
import { STATUS } from '../constants/status.js';
import { submitComplaint, NotConnectedError } from '../api/client.js';

// Owns the investigation lifecycle for the UI. Components only read
// { status, errorMessage, result } and call submit() / reset().
//
// `result` is a view-model for ResultsSection (see that file for its shape).
// When the backend contract is agreed, write one adapter that converts the
// API response into that view-model and call setResult() with it here.
export function useInvestigation() {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);

  const submit = useCallback(async (text) => {
    setErrorMessage('');
    setResult(null);
    setStatus(STATUS.SUBMITTING);
    try {
      await submitComplaint({ text });
      // TODO: with the real API, store the run id, then poll getRun(runId):
      //   setStatus(STATUS.QUEUED) -> INVESTIGATING -> VERIFYING ->
      //   COMPLETED or HUMAN_REVIEW, and call setResult(adapter(response)).
    } catch (error) {
      setStatus(STATUS.FAILED);
      setErrorMessage(
        error instanceof NotConnectedError
          ? 'The analysis service is not connected to this page yet, so no investigation was started.'
          : 'The service could not be reached. Check your connection and try again.'
      );
    }
  }, []);

  const reset = useCallback(() => {
    setStatus(STATUS.IDLE);
    setErrorMessage('');
    setResult(null);
  }, []);

  return { status, errorMessage, result, submit, reset };
}
