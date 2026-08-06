# H12 guaranteed-critical attribute ability

Target: `wxf9af2417e78ce07a/18`
Recovered: 2026-08-06

## Confirmed table contract

- `baglike.BagLikeAbilityEffectConfig` row `RG_H12_abl02_eff01` belongs to
  `RG_H12_abl02`, has quality 3, weight 100, times 1, range `H12/H08`, and requires
  `HERO_STAR_GE H12 2`. Its shipped description says lightning-cloud damage always crits.
- `baglike.BagLikeAbilityEffectiveConfig` maps the same ID to `effectType=ATTR` with
  `attr.CRI_RATE=10000`.
- `battle.AttributeConfig` defines `CRI_RATE` as a permyriad attribute clamped to
  `[0,10000]`, so the supplied value is exactly a 100% critical rate.

## Confirmed runtime consumer

- `BagLikeBuffManager.addEffective` routes `ATTR` to `addAttr`.
- For `rangeType=HERO`, `addAttr` calls `exAttrMgr.addSpecialHeroAttr` for every ID in
  the ability range. The attribute therefore applies to H12 and its H08 companion scope,
  not unrelated heroes.
- `FightFormula.fight` injects special hero `CRI_RATE` into one-shot attacks whose
  `casterUid=-1` and `attrHeroId` identifies the producing hero. This is the WHEEL route
  already recovered for the H12 lightning cloud.
- `FightFormula` evaluates dodge before `checkCrit`. A dodge keeps the original 50%
  miss branch and skips critical RNG; otherwise `checkCrit` rolls against the clamped
  10000 rate and uses the base 15000 critical factor.

## Reconstruction mapping

- `BagLikeProgression.ts` adds the exact star-2, quality, weight, range, cap and
  `criticalRate=10000` effect row.
- `CangshuGame.attrsFor` joins the selected effect into H12/H08 `critRate` and clamps it
  to 10000 before the existing damage kernel runs.
- `BattlefieldKernel.resolveBattleDamageWithRandom` now performs lazy RNG reads matching
  the recovered order: a dodge skips critical RNG; a one-use forced critical also
  short-circuits critical RNG; an attribute-based 100% critical still consumes the normal
  critical roll after a non-dodge.
- The conservative default `h12HeroStar=1` does not expose this card. It becomes eligible
  only when an explicit/evidenced H12 star value is at least 2.

## Validation

- `baglike-traits.test.mjs`: 98/98 assertions, including the exact H12 row, star-1/2
  boundary, H12/H08 scope and one-time cap.
- `battlefield-kernel.test.mjs`: 37/37 assertions, including lazy RNG call counts and
  H12 49-attack, 5000-ratio critical damage (`floor(49 * 0.5 * 1.5) = 36`).
- Full rule/resource suite: 12 scripts, 586/586 assertions.
- Creator 3.8.8 TypeScript: pass with `--noEmit --skipLibCheck`.

## Remaining boundary

This closes the damage outcome and the local dodge/critical RNG ordering for the recovered
ability. It does not prove the competitor account's actual H12 star, nor does it close the
broader same-frame RNG order for targeting, spawn offsets, rewards and phase transitions.
