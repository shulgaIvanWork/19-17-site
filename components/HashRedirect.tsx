'use client';

import { useEffect } from 'react';

/** Old service URLs become section hashes on the three hub pages. */
export function HashRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}
