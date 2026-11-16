import React from 'react';
import Icon from './Icon.jsx';

const NOT_PROVIDED = 'Not provided';

// props: variant ('assign' | 'referral'), regulator, entity, routing, explanation,
//        verified (boolean), humanReviewStatus (string)
export default function RecommendationCard({
  variant = 'assign',
  regulator,
  entity,
  routing,
  explanation,
  verified = false,
  humanReviewStatus,
}) {
  const title = variant === 'referral' ? 'Referral to another regulator' : 'Recommended routing';
  return (
    <article className="recommendation">
      <header className="recommendation__head">
        <h3>{title}</h3>
        {verified ? (
          <p className="badge badge--ok">
            <Icon name="check" size={16} /> Evidence verified
          </p>
        ) : (
          <p className="badge badge--warn">
            <Icon name="alert" size={16} /> Not verified. Draft for human review only
          </p>
        )}
      </header>

      <dl className="facts">
        <div>
          <dt>Recommended regulator</dt>
          <dd>{regulator || NOT_PROVIDED}</dd>
        </div>
        <div>
          <dt>Responsible entity</dt>
          <dd>{entity || NOT_PROVIDED}</dd>
        </div>
        <div className="facts__wide">
          <dt>Routing recommendation</dt>
          <dd>{routing || NOT_PROVIDED}</dd>
        </div>
        <div className="facts__wide">
          <dt>Why</dt>
          <dd>{explanation || NOT_PROVIDED}</dd>
        </div>
        <div className="facts__wide">
          <dt>Human review</dt>
          <dd>{humanReviewStatus || 'A grievance officer makes the final decision.'}</dd>
        </div>
      </dl>
    </article>
  );
}
