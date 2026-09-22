import type { Claim } from '@/content/products';

/** Пронумерованный признак: метка цветом pewter, заголовок 17/500, текст.
 *  Номер набран текстовой гарнитурой: у дисплейной нет пригодных цифр. */
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
