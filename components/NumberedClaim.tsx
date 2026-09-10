import type { Claim } from '@/content/products';

/** A numbered claim: pewter label, 17/500 title, body. The numeral sits in the
 *  text face - the display face has no usable digits. */
export function NumberedClaim({ claim }: { claim: Claim }) {
  return (
    <div>
      <div className="label">{claim.num}</div>
      <h3 className="h3" style={{ marginTop: 10 }}>
        {claim.title}
      </h3>
      <p className="body" style={{ marginTop: 8 }}>
        {claim.body}
      </p>
    </div>
  );
}
