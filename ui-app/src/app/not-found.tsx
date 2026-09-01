"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './not-found.module.css';
import { Home } from 'lucide-react';

export default function NotFound() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
      </header>

      <main className={styles.mainContent}>


        <div className={styles.centerBox}>
          
          <div className={styles.ticketWrapper} onMouseEnter={() => setRevealed(true)} onMouseLeave={() => setRevealed(false)}>
            <div className={styles.ticket}>
              <div className={styles.ticketLeft}>
                <h2 className={styles.ticketTitle}>404 ERROR</h2>
                <div className={styles.ticketSubtitle}>MISSING PAGE</div>
                <div className={styles.ticketNumberBox}>
                  <span className={styles.ticketNo}>NO.</span>
                  <span className={styles.ticketCode}>404</span>
                </div>
              </div>
              <div className={styles.ticketRight}>
                <Image src="/retro-tv-404.jpg" alt="404 TV" width={220} height={220} style={{ objectFit: 'contain', mixBlendMode: 'multiply', transform: 'scale(1.2)' }} />
              </div>
            </div>

            <div className={`${styles.slip} ${revealed ? styles.slipRevealed : ''}`}>
              <h1 className={styles.slipTitle}>PAGE NOT FOUND</h1>
              <div className={styles.slipSubtitle}>
                <span className={styles.cursive}>Looks like this link</span>
                <span className={styles.boldText}>
                  DOESN'T EXIST.
                  <div className={styles.underline}></div>
                </span>
              </div>
              <Link href="/dashboard" className={styles.homeLink}>
                <Home size={16} />
                Go home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
