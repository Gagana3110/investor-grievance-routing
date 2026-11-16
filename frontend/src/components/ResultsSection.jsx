import React from 'react';
import { STATUS, isInProgress } from '../constants/status.js';
import EmptyState from './EmptyState.jsx';
import RecommendationCard from './RecommendationCard.jsx';
import EvidenceCard from './EvidenceCard.jsx';
import EscalationNotice from './EscalationNotice.jsx';

// `result` is a UI view-model. It is NOT the backend schema. A future adapter
// converts the API response into this shape:
// {
//   outcome: 'recommendation' | 'referral' | 'escalation',
//   recommendation: { regulator, entity, routing, explanation, verified, humanReviewStatus },
//   evidence: [{ passage, citation: { document, section, page } }],
//   escalation: { reason },
// }
export default function ResultsSection({ status = STATUS.IDLE, result = null }) {
  const evidence = result?.evidence ?? [];
  const escalated = status === STATUS.HUMAN_REVIEW || result?.outcome === 'escalation';

  let content;
  if (status === STATUS.IDLE) {
    content = (
      <EmptyState icon="search" title="No complaint submitted yet">
        Submit a complaint above. The recommendation and its supporting evidence will appear here.
      </EmptyState>
    );
  } else if (isInProgress(status)) {
    content = (
      <EmptyState icon="clock" tone="info" title="Investigation in progress">
        Results appear once the evidence has been verified. Nothing is shown until then.
      </EmptyState>
    );
  } else if (status === STATUS.FAILED) {
    content = (
      <EmptyState icon="alert" tone="danger" title="No result">
        The investigation did not finish, so there is nothing to show. Nothing here should be treated as a
        recommendation.
      </EmptyState>
    );
  } else if (escalated) {
    content = <EscalationNotice reason={result?.escalation?.reason} />;
  } else if (evidence.length === 0) {
    content = (
      <EmptyState icon="doc" tone="warn" title="No verified evidence available">
        No passage could be verified for this complaint, so no recommendation is shown. A grievance officer should review
        it.
      </EmptyState>
    );
  } else {
    content = (
      <>
        <RecommendationCard
          variant={result.outcome === 'referral' ? 'referral' : 'assign'}
          {...result.recommendation}
        />
        <div className="evidence-list">
          <h3>Supporting regulatory evidence</h3>
          {evidence.map((item, index) => (
            <EvidenceCard key={index} {...item} />
          ))}
        </div>
      </>
    );
  }

  return (
    <section className="section" id="results" aria-labelledby="results-title">
      <div className="section__head">
        <h2 id="results-title">Results</h2>
        <p>Recommendations are shown only with evidence that has been checked.</p>
      </div>
      <div className="results">{content}</div>
    </section>
  );
}
