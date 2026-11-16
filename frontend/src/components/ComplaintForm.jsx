import React, { useRef, useState } from 'react';
import Icon from './Icon.jsx';

export const MAX_LENGTH = 4000; // Placeholder limit. Align with the backend data contract.

export default function ComplaintForm({ onSubmit, busy = false }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  const nearLimit = text.length >= MAX_LENGTH * 0.9;

  function handleChange(event) {
    setText(event.target.value);
    if (error) setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    if (text.trim().length === 0) {
      setError('Enter your complaint before analysing it. Describe what happened and which firm or product was involved.');
      textareaRef.current?.focus();
      return;
    }
    onSubmit(text.trim());
  }

  return (
    <form className="panel complaint-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor="complaint-text">
          Describe your complaint
        </label>
        <p className="field__hint" id="complaint-hint">
          Write it as you would to a regulator. Use a synthetic or anonymised example. Do not enter names, account
          numbers, PAN or other personal or financial details.
        </p>
        <textarea
          id="complaint-text"
          ref={textareaRef}
          className="field__textarea"
          value={text}
          onChange={handleChange}
          maxLength={MAX_LENGTH}
          rows={9}
          placeholder="What happened, which firm or product was involved, and what outcome you want."
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'complaint-hint complaint-error' : 'complaint-hint'}
          disabled={busy}
        />
        {error && (
          <p className="field__error" id="complaint-error" role="alert">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </p>
        )}
      </div>

      <div className="complaint-form__footer">
        <p className={`counter${nearLimit ? ' counter--near' : ''}`} aria-live="polite">
          {text.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()} characters
        </p>
        <button className="button" type="submit" disabled={busy} aria-busy={busy}>
          {busy && <span className="spinner" aria-hidden="true" />}
          {busy ? 'Analyzing…' : 'Analyze Complaint'}
        </button>
      </div>

      <p className="disclaimer">
        <Icon name="shield" size={18} />
        <span>
          This service gives routing recommendations for human review. It does not make final regulatory decisions, and
          a grievance officer decides every complaint.
        </span>
      </p>
    </form>
  );
}
