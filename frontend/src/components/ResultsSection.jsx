import React from 'react';
import { STATUS, isInProgress } from '../constants/status.js';
import EmptyState from './EmptyState.jsx';
import EscalationNotice from './EscalationNotice.jsx';

export default function ResultsSection({ status = STATUS.IDLE, result = null }) {
  if (status === STATUS.IDLE) {
    return (
      <section className="section" id="results">
        <div className="section__head"><h2>Results</h2></div>
        <EmptyState icon="search" title="No complaint submitted yet">
          Submit a complaint above. Its recommendation and supporting evidence
          will appear here.
        </EmptyState>
      </section>
    );
  }

  if (isInProgress(status)) {
    return (
      <section className="section" id="results">
        <div className="section__head"><h2>Results</h2></div>
        <EmptyState icon="clock" tone="info" title="Investigation in progress">
          The backend is processing your complaint. Please wait.
        </EmptyState>
      </section>
    );
  }

  if (status === STATUS.FAILED) {
    return (
      <section className="section" id="results">
        <div className="section__head"><h2>Results</h2></div>
        <EmptyState icon="alert" tone="danger" title="No result available">
          The investigation could not be completed.
        </EmptyState>
      </section>
    );
  }

  if (!result) return null;

  const citations = result.citations || [];
  const needsReview =
    result.human_review_required ||
    status === STATUS.HUMAN_REVIEW;

  return (
    <section className="section" id="results">
      <div className="section__head">
        <h2>Investigation Results</h2>
        <p>Backend-generated routing recommendation and supporting evidence.</p>
      </div>

      <div className="results">
        {needsReview && (
          <EscalationNotice
            reason={
              result.escalation_reason ||
              'This complaint requires review by a grievance officer.'
            }
          />
        )}

        <div className="panel">
          <h3>Routing recommendation</h3>
          <p><strong>Status:</strong> {result.status || 'Not specified'}</p>
          <p><strong>Route type:</strong> {result.route_type || 'Not specified'}</p>
          <p>
            <strong>Recommended regulator:</strong>{' '}
            {result.recommended_regulator || 'No regulator recommendation'}
          </p>
          <p>
            <strong>Responsible entity:</strong>{' '}
            {result.responsible_entity || 'Not identified'}
          </p>
          <p><strong>Reason:</strong> {result.reason || 'Not provided'}</p>
          {result.timeline && (
            <p><strong>Timeline:</strong> {result.timeline}</p>
          )}
          <p>
            <strong>Human review required:</strong>{' '}
            {result.human_review_required ? 'Yes' : 'No'}
          </p>
        </div>

        {result.escalation_reason && !needsReview && (
          <div className="panel">
            <h3>Escalation information</h3>
            <p>{result.escalation_reason}</p>
          </div>
        )}

        <div className="panel">
          <h3>Supporting regulatory citations ({citations.length})</h3>
          {citations.length === 0 ? (
            <p>No regulatory citations were returned for this investigation.</p>
          ) : (
            citations.map((citation, index) => (
              <article className="evidence-card" key={index}>
                <h4>{citation.source_title}</h4>
                <p><strong>Version:</strong> {citation.source_version}</p>
                <p><strong>Section:</strong> {citation.section}</p>
                <p>{citation.passage}</p>
                {citation.source_url && (
                  <a href={citation.source_url} target="_blank" rel="noreferrer">
                    View source
                  </a>
                )}
              </article>
            ))
          )}
        </div>

        <p className="field__hint">
          Run ID: {result.run_id || 'Unavailable'}
        </p>
      </div>
    </section>
  );
}