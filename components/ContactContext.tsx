'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { contactCopy } from '@/content/site';

const ContactModal = dynamic(() => import('./ContactModal').then((mod) => mod.ContactModal));

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
  const [interests, setInterests] = useState<string[]>([]);

  const open = useCallback((preset?: string) => {
    setInterests(preset && contactCopy.interests.includes(preset) ? [preset] : []);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {isOpen && <ContactModal interests={interests} onInterestsChange={setInterests} onClose={close} />}
    </Ctx.Provider>
  );
}
