'use client';

import { useState } from 'react';
import styles from './Footer.module.scss';

const FULL = 'Results are estimates for informational purposes only and do not constitute medical advice. Consult a qualified healthcare professional before making any health-related decisions. Use of this tool is at your own risk.';

export default function FooterDisclaimer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.disclaimerBar}>
      <div className="container">
        <div className={styles.disclaimerRow}>
          <span className={expanded ? styles.disclaimerFull : styles.disclaimerClipped}>
            <strong className={styles.disclaimerLabel}>Disclaimer: </strong>
            {FULL}
          </span>
          <button
            className={styles.disclaimerToggle}
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>
    </div>
  );
}
