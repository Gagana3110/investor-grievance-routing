import React from 'react';

const NOT_AVAILABLE = 'Not available';

export default function CitationDetails({ document, section, page }) {
  return (
    <dl className="citation">
      <div>
        <dt>Document</dt>
        <dd>{document || NOT_AVAILABLE}</dd>
      </div>
      <div>
        <dt>Section</dt>
        <dd>{section || NOT_AVAILABLE}</dd>
      </div>
      <div>
        <dt>Page</dt>
        <dd>{page ?? NOT_AVAILABLE}</dd>
      </div>
    </dl>
  );
}
