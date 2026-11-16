import React from 'react';
import Icon from './Icon.jsx';

// Static explanation of the three possible outcomes. It describes the kinds of
// outcome only. It never states a regulator, citation or decision.
const TILES = [
  {
    icon: 'doc',
    tone: 'sapphire',
    title: 'Assign to the responsible entity',
    body: 'When the evidence supports it, the complaint is matched to the regulated entity and the provisions that apply.',
  },
  {
    icon: 'route',
    tone: 'mist',
    title: 'Refer to another regulator',
    body: 'Some complaints belong elsewhere. The recommendation names the regulator and the passage that says so.',
  },
  {
    icon: 'user',
    tone: 'lagoon',
    title: 'Escalate to a person',
    body: 'If evidence is missing, conflicting or outside the supported documents, a grievance officer takes over.',
  },
  {
    icon: 'check',
    tone: 'paper',
    title: 'Checked before it is shown',
    body: 'Every recommendation is checked against the retrieved passages. Anything that cannot be checked is not shown as an answer.',
  },
];

export default function OutcomeOverview() {
  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <div className="section__head">
        <h2 id="how-title">What happens to a complaint</h2>
        <p>The service recommends. People decide.</p>
      </div>
      <ul className="tiles">
        {TILES.map((tile) => (
          <li key={tile.title} className={`tile tile--${tile.tone}`}>
            <span className="tile__icon">
              <Icon name={tile.icon} size={22} />
            </span>
            <h3>{tile.title}</h3>
            <p>{tile.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
