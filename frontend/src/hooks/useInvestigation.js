import { useCallback, useState } from 'react';
import { STATUS } from '../constants/status.js';
import { submitComplaint, getRun } from '../api/client.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function useInvestigation() {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);

  const submit = useCallback(async (formData) => {
    setErrorMessage('');
    setResult(null);
    setStatus(STATUS.SUBMITTING);

    try {
      const submission = await submitComplaint({
        complaint_text: formData.complaint_text,
        product_type: formData.product_type || null,
        entity_name: formData.entity_name || null,
        entity_type: formData.entity_type || null,
        consent_to_process: formData.consent_to_process,
      });

      const runId = submission.run_id;

      if (!runId) {
        throw new Error('The server did not return an investigation ID.');
      }

      setStatus(STATUS.QUEUED);

      for (let attempt = 0; attempt < 90; attempt += 1) {
        await delay(2000);

        const run = await getRun(runId);

        if (run.status === 'completed') {
          setResult({
            ...run.result,
            run_id: runId,
          });

          setStatus(
            run.result?.human_review_required
              ? STATUS.HUMAN_REVIEW
              : STATUS.COMPLETED
          );
          return;
        }

        if (run.status === 'failed') {
          throw new Error(
            run.error || 'The investigation could not be completed.'
          );
        }

        setStatus(STATUS.INVESTIGATING);
      }

      throw new Error(
        'The investigation is taking longer than expected. Please try again.'
      );
    } catch (error) {
      setStatus(STATUS.FAILED);
      setErrorMessage(
        error.message || 'The service could not be reached. Please try again.'
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