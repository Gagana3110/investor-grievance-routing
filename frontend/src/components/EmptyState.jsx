import React from 'react';
import Icon from './Icon.jsx';

// tone: 'neutral' | 'info' | 'warn' | 'danger'
export default function EmptyState({ icon = 'doc', tone = 'neutral', title, children, action, role }) {
  return (
    <div className={`empty empty--${tone}`} role={role}>
      <span className="empty__icon">
        <Icon name={icon} size={24} />
      </span>
      <div className="empty__body">
        <h3>{title}</h3>
        {children && <p>{children}</p>}
        {action}
      </div>
    </div>
  );
}
