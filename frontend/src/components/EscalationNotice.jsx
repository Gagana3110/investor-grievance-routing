import React from 'react';
import Icon from './Icon.jsx';

export default function EscalationNotice({ reason }) {
  return (
    <div className="escalation" role="status">
      <span className="escalation__icon">
        <Icon name="flag" size={24} />
      </span>
      <div>
        <h3>Escalated to a grievance officer</h3>
        <p>
          The system does not have verified evidence for a recommendation, so it has not made one. A person will decide
          where this complaint goes.
        </p>
        <p className="escalation__reason">
          <strong>Reason: </strong>
          {reason || 'No reason was provided.'}
        </p>
      </div>
    </div>
  );
}
