# Visual validation

## Reference capture

Use the same:

- device aspect ratio and design resolution;
- level and round;
- preparation/battle/result phase;
- elapsed time after phase start;
- unlocked content and equipped items.

Without a matched reference, label layout claims approximate.

For motion, capture a state matrix rather than one battle screenshot:

| State | Required observation |
|---|---|
| preparation | intended animated objects are static or running as evidenced |
| battle start | reset angle/frame/direction and exact start condition |
| battle steady state | elapsed-time samples proving speed and loop period |
| pause and speed-up | whether presentation follows simulation speed |
| round clear and retry | stop/reset/carry-over behavior |

Do not derive visual loop duration from a gameplay timer unless the original runtime
consumer explicitly couples them.

## Comparison passes

Begin these passes after the representative level's `mechanicsData` check passes. Before
then, use captures only to diagnose state, timing, or numeric divergence; defer cosmetic
matching.

1. Silhouette: camera crop, battlefield/UI split, bases, large panels.
2. Geometry: anchors, dimensions, spacing, scale, sorting.
3. Motion: spawn timestamps, move speed, attack anticipation, hit delay, death duration.
4. Numbers: HP, damage, cooldowns, rewards, win/loss transitions.
5. Polish: fonts, colors, effects, audio, touch feedback.

Store every unresolved difference with severity, evidence needed, owner, and next
verification action.

Mark each required row `confirmed`, `approximate`, or `missing`. An approximate required
motion/audio row may support a functional build, but it cannot support a
`battlefield-faithful` claim.
