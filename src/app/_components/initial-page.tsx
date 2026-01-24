'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DESCRICAO_INITIAL_PAGE,
  SUBTITULO_INITIAL_PAGE,
  TEXTOS_ALTERNADOS_INITIAL_PAGE,
  TITULO_INITIAL_PAGE,
} from '../../../constants';

const textosAlternados = TEXTOS_ALTERNADOS_INITIAL_PAGE
  ? TEXTOS_ALTERNADOS_INITIAL_PAGE
  : 'errando.|acertando.';

export default function InitialState() {
  const [titleNumber, setTitleNumber] = useState(0);

  const titles = textosAlternados.split('|');

  useEffect(() => {
    if (titles.length === 0) return;
    const timeoutId = setTimeout(() => {
      setTitleNumber(prev => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber]);

  return (
    <div className="w-full">
      <div className="container mx-auto relative">
        <div className="absolute right-4"></div>
        <div className="flex gap-8 items-center justify-center flex-col">
          <div>{TITULO_INITIAL_PAGE}</div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">{SUBTITULO_INITIAL_PAGE}</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
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
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              {DESCRICAO_INITIAL_PAGE}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
