'use client';

import { useEffect } from 'react';

export default function MaintenanceRedirect() {
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, '');
    window.location.replace(id === 'support' ? '/websites#support' : '/websites#redesign');
  }, []);
  return null;
}
