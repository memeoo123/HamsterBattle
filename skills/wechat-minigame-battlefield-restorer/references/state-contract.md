# Battlefield restore state contract

Store `BATTLEFIELD_RESTORE_STATE.json` under the isolated target root. Copy the bundled
template and replace every placeholder. Use repository- or target-relative artifact paths
where practical.

The required subsystem IDs are:

- `phase-flow`
- `preparation`
- `deployment-and-production`
- `entities-and-attributes`
- `targeting-and-movement`
- `attack-and-damage`
- `skills-buffs-status`
- `waves-and-scaling`
- `outcomes-and-persistence`
- `presentation-and-feedback`

Each subsystem records three independent dimensions:

- `evidenceStatus`: `unknown`, `partial`, or `confirmed`;
- `implementationStatus`: `missing`, `partial`, or `implemented`;
- `validationStatus`: `untested`, `numeric-pass`, `integration-pass`, or `replay-pass`.

Set `scope` to `required`, `deferred`, or `not-applicable`. A deferred subsystem prevents a
full fidelity claim. A not-applicable subsystem needs a cited reason in `notes`.

Use `evidence` for stable source/capture references, `unknowns` for unresolved behavior plus
the smallest verification action, and `tests` for commands, case IDs, traces, or reports.
Do not remove an unknown merely because implementation chose a value.

Top-level gates use `pending`, `pass`, or `blocked`. Gate status summarizes work but does not
override subsystem data. `completionClaim` is one of `incomplete`, `representative-level`,
or `battlefield-faithful`.

`representative-level` requires every required subsystem to have confirmed evidence,
implemented behavior, no unknowns, and at least integration validation.
`battlefield-faithful` additionally requires replay validation for every required subsystem,
no deferred subsystem, and no blocker.
