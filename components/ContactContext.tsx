'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ContactModal } from './ContactModal';
import { contactCopy } from '@/content/site';

type ContactValue = {
  open: (interest?: string) => void;
  close: () => void;
};

const Ctx = createContext<ContactValue | null>(null);

export function useContact() {
  const value = useContext(Ctx);
  if (!value) throw new Error('useContact must be used inside <ContactProvider>');
  return value;
}

/** Holds the Contact Sales modal for every route. Mounted once, in the layout. */
export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  // Значение по умолчанию берётся из списка чипов, а не дублируется строкой:
  // иначе при правке списка оно молча перестаёт совпадать и сервер отклоняет заявку.
  const [interest, setInterest] = useState(contactCopy.interests[0]);

  const open = useCallback((preset?: string) => {
    if (preset) setInterest(preset);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {isOpen && <ContactModal interest={interest} onInterestChange={setInterest} onClose={close} />}
    </Ctx.Provider>
  );
}
