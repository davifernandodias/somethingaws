'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  INITIAL_PAGE_DESCRIPTION,
  INITIAL_PAGE_SUBTITLE,
  INITIAL_PAGE_ALTERNATING_TEXTS,
  INITIAL_PAGE_TITLE,
} from '../../../constants';

const textosAlternados = INITIAL_PAGE_ALTERNATING_TEXTS
  ? INITIAL_PAGE_ALTERNATING_TEXTS
  : 'errando.|acertando.';

export default function InitialState() {
  const [titleNumber, setTitleNumber] = useState(0);

  const titles = useMemo(() => textosAlternados.split('|'), []);

  useEffect(() => {
    if (titles.length === 0) return;

    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles.length]);

  return (
    <div className="w-full">
      <div className="relative container mx-auto">
        <div className="absolute right-4"></div>
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div>{INITIAL_PAGE_TITLE}</div>
          <div className="flex flex-col gap-4">
            <h1 className="font-regular max-w-2xl text-center text-5xl tracking-tighter md:text-7xl">
              <span className="text-spektr-cyan-50">{INITIAL_PAGE_SUBTITLE}</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pt-1 md:pb-4">
                &nbsp;
                <AnimatePresence mode="wait">
                  <motion.span
                    key={titleNumber}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: '-100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ type: 'spring', stiffness: 50 }}
                  >
                    {titles[titleNumber]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-center text-lg leading-relaxed tracking-tight md:text-xl">
              {INITIAL_PAGE_DESCRIPTION}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
