import React, { useRef, useState } from 'react';
import Icon from './Icon.jsx';

export const MAX_LENGTH = 8000;

const ENTITY_TYPES = [
  ['broker', 'Broker'],
  ['mutual_fund', 'Mutual fund'],
  ['registrar', 'Registrar'],
  ['listed_company', 'Listed company'],
  ['depository', 'Depository'],
  ['bank_or_other', 'Bank / Other'],
  ['unknown', 'Unknown'],
];

export default function ComplaintForm({ onSubmit, busy = false }) {
  const [text, setText] = useState('');
  const [productType, setProductType] = useState('');
  const [entityName, setEntityName] = useState('');
  const [entityType, setEntityType] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;

    if (text.trim().length < 20) {
      setError('Please enter at least 20 characters describing your complaint.');
      textareaRef.current?.focus();
      return;
    }

    if (!consent) {
      setError('Please provide consent before submitting your complaint.');
      return;
    }

    setError('');

    onSubmit({
      complaint_text: text.trim(),
      product_type: productType.trim(),
      entity_name: entityName.trim(),
      entity_type: entityType || null,
      consent_to_process: true,
    });
  }

  return (
    <form className="panel complaint-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor="complaint-text">
          Describe your complaint
        </label>
        <p className="field__hint" id="complaint-hint">
          Use a synthetic or anonymised example. Do not enter names, account
          numbers, PAN or other personal or financial details.
        </p>
        <textarea
          id="complaint-text"
          ref={textareaRef}
          className="field__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_LENGTH}
          rows={9}
          minLength={20}
          placeholder="Describe what happened, which firm or product was involved, and what outcome you want."
          aria-describedby="complaint-hint"
          disabled={busy}
          required
        />
        <p className="counter" aria-live="polite">
          {text.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()} characters
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="product-type">
          Product type (optional)
        </label>
        <input
          id="product-type"
          className="field__input"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          maxLength={120}
          placeholder="e.g. Mutual fund, fixed deposit, shares"
          disabled={busy}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="entity-name">
          Entity name (optional)
        </label>
        <input
          id="entity-name"
          className="field__input"
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
          maxLength={200}
          placeholder="e.g. Example Bank"
          disabled={busy}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="entity-type">
          Entity type (optional)
        </label>
        <select
          id="entity-type"
          className="field__input"
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
          disabled={busy}
        >
          <option value="">Select entity type</option>
          {ENTITY_TYPES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={busy}
          />{' '}
          I consent to processing this complaint for the purpose of this
          demonstration.
        </label>
      </div>

      {error && (
        <p className="field__error" role="alert">
          <Icon name="alert" size={18} />
          <span>{error}</span>
        </p>
      )}

      <div className="complaint-form__footer">
        <button
          className="button"
          type="submit"
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? 'Analyzing…' : 'Analyze Complaint'}
        </button>
      </div>

      <p className="disclaimer">
        <Icon name="shield" size={18} />
        <span>
          This service provides routing recommendations for human review. It
          does not make final regulatory decisions.
        </span>
      </p>
    </form>
  );
}