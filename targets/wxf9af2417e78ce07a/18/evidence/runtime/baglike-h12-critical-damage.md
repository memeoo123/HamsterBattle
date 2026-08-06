# H12 critical-damage attribute ability

Target: `wxf9af2417e78ce07a/18`
Recovered: 2026-08-06

## Confirmed table contract

- `baglike.BagLikeAbilityEffectConfig` row `RG_H12_abl03_eff01` belongs to
  `RG_H12_abl03`, has quality 3, weight 100, times 1, range `H12/H08`, and requires
  `HERO_STAR_GE H12 7`. Its description says lightning-cloud critical damage rises 50%.
- `baglike.BagLikeAbilityEffectiveConfig` routes the row through `ATTR` with
  `CRI_DMG=5000`.
- `battle.AttributeConfig` defines `CRI_DMG` as a permyriad attribute with range
  `[0,25000]`.

## Runtime interpretation

- The previously recovered `BagLikeBuffManager.addAttr` HERO branch writes the attribute
  to each hero ID in the H12/H08 scope.
- `FightFormula.fight` reads `CRI_DMG` only after a successful non-dodge critical check and
  computes the critical multiplier as `(baseCritValue + max(0, CRI_DMG)) / 10000`.
- The recovered base critical value is 15000. This ability therefore changes a critical
  from 1.5x to 2.0x; it does not grant critical chance by itself.

## Reconstruction mapping

- `BagLikeProgression.ts` contains the exact star-7 row and exposes
  `criticalDamage=5000` for H12/H08 only.
- `CangshuGame.attrsFor` adds and clamps trait critical damage to the table maximum 25000.
- The existing damage kernel already adds non-negative source critical damage to the
  15000 base factor. With H12 attack 49 and effect ratio 5000, a critical with this card
  resolves to `floor(49 * 0.5 * 2.0) = 49`.
- The default `h12HeroStar=1` keeps the star-7 card outside the baseline pool.

## Validation

- `baglike-traits.test.mjs`: 105/105 assertions, including star 6/7 boundary,
  H12/H08 scope and one-time cap.
- `battlefield-kernel.test.mjs`: 38/38 assertions, including the exact H12 2.0x result.
- Full rule/resource suite: 12 scripts, 594/594 assertions.
- Creator 3.8.8 TypeScript: pass with `--noEmit --skipLibCheck`.

## Remaining boundary

The table and runtime prove the mechanic but do not prove that the competitor account has
H12 star 7. Exact account eligibility remains external evidence, and critical/status visual
feedback remains presentation work.
