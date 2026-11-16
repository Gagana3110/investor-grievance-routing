import React from 'react';
import { STATUS, STATUS_META, isInProgress } from '../constants/status.js';
import EmptyState from './EmptyState.jsx';

const STEPS = [STATUS.SUBMITTING, STATUS.QUEUED, STATUS.INVESTIGATING, STATUS.VERIFYING];

// Reusable status display. Pass the current `status`. Optional: `errorMessage`, `onRetry`.
export default function StatusPanel({ status = STATUS.IDLE, errorMessage = '', onRetry }) {
  const meta = STATUS_META[status];

  let content;
  if (status === STATUS.IDLE) {
    content = (
      <EmptyState icon="clock" title="No complaint submitted yet">
        Progress appears here once you submit a complaint.
      </EmptyState>
    );
  } else if (isInProgress(status)) {
    const current = STEPS.indexOf(status);
    content = (
      <div className="progress" role="status">
        <h3>{meta.label}</h3>
        <p>{meta.description}</p>
        <div className="progress__bar" aria-hidden="true">
          <span />
        </div>
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className={index < current ? 'is-done' : index === current ? 'is-current' : ''}
              aria-current={index === current ? 'step' : undefined}
            >
              {STATUS_META[step].label}
            </li>
          ))}
        </ol>
        <p className="progress__note">Runs can take a while. You can leave this page open.</p>
      </div>
    );
  } else if (status === STATUS.COMPLETED) {
    content = (
      <EmptyState icon="check" tone="info" title={meta.label} role="status">
        {meta.description}
      </EmptyState>
    );
  } else if (status === STATUS.HUMAN_REVIEW) {
    content = (
      <EmptyState icon="user" tone="warn" title={meta.label} role="status">
        {meta.description}
      </EmptyState>
    );
  } else {
    content = (
      <EmptyState
        icon="alert"
        tone="danger"
        title="Investigation failed"
        role="alert"
        action={
          onRetry && (
            <button className="button button--ghost" type="button" onClick={onRetry}>
              Edit and try again
            </button>
          )
        }
      >
        {errorMessage || meta.description} No recommendation was produced.
      </EmptyState>
    );
  }

  return (
    <section className="section" id="status" aria-labelledby="status-title">
      <div className="section__head">
        <h2 id="status-title">Analysis status</h2>
        <p>Follow the investigation from submission to outcome.</p>
      </div>
      <div className="panel">{content}</div>
    </section>
  );
}
