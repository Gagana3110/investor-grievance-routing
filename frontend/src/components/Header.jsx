import React from 'react';
import Icon from './Icon.jsx';

const NAV = [
  { href: '#submit', label: 'Submit complaint' },
  { href: '#how', label: 'How it works' },
  { href: '#status', label: 'Status' },
  { href: '#results', label: 'Results' },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__bar">
        <a className="brand" href="#top" aria-label="Investor Grievance Routing, home">
          <span className="brand__mark" aria-hidden="true">
            <Icon name="route" size={22} />
          </span>
          <span className="brand__text">
            <span className="brand__name">Investor Grievance Routing</span>
            <span className="brand__tagline">The right regulator, with the evidence shown</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Sections">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="ai-badge">
          <Icon name="spark" size={16} />
          <span>AI-assisted recommendations</span>
        </p>
      </div>
    </header>
  );
}
