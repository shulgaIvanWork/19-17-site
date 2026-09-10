'use client';

import { useEffect } from 'react';

export default function IntegrationsRedirect() {
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, '');
    window.location.replace(id === 'crm' ? '/websites#crm' : '/websites#onec');
  }, []);
  return null;
}
