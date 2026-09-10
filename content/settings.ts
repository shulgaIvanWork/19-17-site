/** Build-time settings.
 *
 *  The prototype exposes these as design-time toggles and the client has been
 *  switching them on and off, so the shipped default is an open question. They
 *  live here so the answer is one edit, not a hunt through components.
 *
 *  Both motion features are deliberate departures from Showroom's no-motion
 *  rule and are client-directed. Both are also disabled automatically under
 *  `prefers-reduced-motion`. */

export const settings = {
  /** Radial highlight following the pointer inside heroes and the header. */
  cursorHighlight: true,
  /** Wireframe objects in the Home and service-page heroes. */
  heroObject: true,
  /** Node count for the Home globe only. Service meshes are sampled sparser. */
  heroObjectNodes: 110,
};
