import React from 'react';
import CitationDetails from './CitationDetails.jsx';

// props: passage (text), citation: { document, section, page }
export default function EvidenceCard({ passage, citation = {} }) {
  return (
    <article className="evidence">
      <blockquote>{passage}</blockquote>
      <CitationDetails {...citation} />
    </article>
  );
}
