import React from 'react';
import Header from './components/Header.jsx';
import ComplaintForm from './components/ComplaintForm.jsx';
import OutcomeOverview from './components/OutcomeOverview.jsx';
import StatusPanel from './components/StatusPanel.jsx';
import ResultsSection from './components/ResultsSection.jsx';
import Icon from './components/Icon.jsx';
import { isInProgress } from './constants/status.js';
import { useInvestigation } from './hooks/useInvestigation.js';

export default function App() {
  const { status, errorMessage, result, submit, reset } = useInvestigation();

  function handleSubmit(text) {
    submit(text);
    document.getElementById('status')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleRetry() {
    reset();
    document.getElementById('submit')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div id="top">
      <a className="skip-link" href="#submit">
        Skip to complaint form
      </a>
      <Header />

      <main>
        <section className="hero container" id="submit" aria-labelledby="submit-title">
          <div className="hero__copy">
            <h1 id="submit-title">Submit an investor complaint</h1>
            <p className="lead">
              Investor complaints often reach the wrong regulator. Describe the problem in your own words and the service
              recommends where it should go and which regulated entity is responsible, citing the regulations it relied on.
            </p>
            <p className="hero__note">
              <Icon name="shield" size={18} />
              <span>Recommendations only. A grievance officer makes every final decision.</span>
            </p>
          </div>
          <ComplaintForm onSubmit={handleSubmit} busy={isInProgress(status)} />
        </section>

        <div className="container">
          <OutcomeOverview />
          <StatusPanel status={status} errorMessage={errorMessage} onRetry={handleRetry} />
          <ResultsSection status={status} result={result} />
        </div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>
            Investor Grievance Routing is an AI-assisted recommendation service. It does not make final regulatory
            decisions. Use synthetic complaints only and do not send anything to a real regulator portal.
          </p>
        </div>
      </footer>
    </div>
  );
}
