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
  /** Radial highlight following the pointer inside any hero. */
  cursorHighlight: true,
  /** The drifting wireframe object behind the Home hero. */
  heroObject: true,
  /** Node count for the wireframe object. Clamped to 40–220 by the component. */
  heroObjectNodes: 110,
  /** How far the object leans toward the pointer, in radians. */
  heroObjectSway: 0.38,
};
