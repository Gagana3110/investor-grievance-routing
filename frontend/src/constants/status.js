// Investigation states the UI can display. The backend run status will be
// mapped onto these in src/hooks/useInvestigation.js once the contract is agreed.
export const STATUS = {
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  QUEUED: 'queued',
  INVESTIGATING: 'investigating',
  VERIFYING: 'verifying_evidence',
  COMPLETED: 'completed',
  HUMAN_REVIEW: 'human_review_required',
  FAILED: 'failed',
};

export const IN_PROGRESS = [STATUS.SUBMITTING, STATUS.QUEUED, STATUS.INVESTIGATING, STATUS.VERIFYING];

export const isInProgress = (status) => IN_PROGRESS.includes(status);

export const STATUS_META = {
  [STATUS.SUBMITTING]: {
    label: 'Submitting',
    description: 'Sending your complaint to the service.',
  },
  [STATUS.QUEUED]: {
    label: 'Queued',
    description: 'Your complaint is waiting for an available investigator.',
  },
  [STATUS.INVESTIGATING]: {
    label: 'Investigating',
    description: 'Searching the regulatory documents for provisions that apply.',
  },
  [STATUS.VERIFYING]: {
    label: 'Verifying evidence',
    description: 'Checking that every citation is supported by the retrieved text.',
  },
  [STATUS.COMPLETED]: {
    label: 'Completed',
    description: 'The investigation finished. Review the recommendation below.',
  },
  [STATUS.HUMAN_REVIEW]: {
    label: 'Human review required',
    description: 'The evidence is not enough for a recommendation. A grievance officer will decide.',
  },
  [STATUS.FAILED]: {
    label: 'Failed',
    description: 'The investigation did not finish.',
  },
};
