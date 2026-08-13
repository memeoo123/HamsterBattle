#!/usr/bin/env python3
"""Regression tests for battlefield completion claims and the bundled template."""

from __future__ import annotations

import copy
import importlib.util
import json
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("validate_battlefield_state.py")
SPEC = importlib.util.spec_from_file_location("validate_battlefield_state", MODULE_PATH)
assert SPEC and SPEC.loader
validator = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(validator)
TEMPLATE_PATH = Path(__file__).resolve().parent.parent / "assets" / "BATTLEFIELD_RESTORE_STATE.template.json"


class BattlefieldStateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.state = json.loads(TEMPLATE_PATH.read_text(encoding="utf-8"))
        self.state["target"] = {
            "appId": "wx0123456789abcdef",
            "version": "1",
            "representativeLevel": 1001,
        }

    def test_populated_template_is_valid_but_incomplete(self) -> None:
        self.assertEqual(validator.validate(self.state, False, False), [])
        self.assertFalse(validator.readiness(self.state)["representativeLevelReady"])

    def test_representative_claim_requires_integration_for_every_required_subsystem(self) -> None:
        for name, subsystem in self.state["subsystems"].items():
            subsystem.update({
                "evidenceStatus": "confirmed",
                "implementationStatus": "implemented",
                "validationStatus": "integration-pass",
                "evidence": [f"evidence/{name}.json"],
                "unknowns": [],
                "tests": [f"test:{name}"],
            })
        self.state["completionClaim"] = "representative-level"
        self.state["blockers"] = []
        for gate in ("evidence", "deterministic", "integration"):
            self.state["gates"][gate]["status"] = "pass"
        self.assertEqual(validator.validate(self.state, False, False, "representative-level"), [])
        self.assertTrue(validator.readiness(self.state)["representativeLevelReady"])
        self.assertFalse(validator.readiness(self.state)["battlefieldFaithfulReady"])

    def test_faithful_claim_requires_replay_for_every_required_subsystem(self) -> None:
        state = copy.deepcopy(self.state)
        for name, subsystem in state["subsystems"].items():
            subsystem.update({
                "evidenceStatus": "confirmed",
                "implementationStatus": "implemented",
                "validationStatus": "replay-pass",
                "evidence": [f"evidence/{name}.json"],
                "unknowns": [],
                "tests": [f"replay:{name}"],
            })
        state["completionClaim"] = "battlefield-faithful"
        state["blockers"] = []
        for gate in state["gates"].values():
            gate["status"] = "pass"
        self.assertEqual(validator.validate(state, False, False, "battlefield-faithful"), [])
        self.assertTrue(validator.readiness(state)["battlefieldFaithfulReady"])


if __name__ == "__main__":
    unittest.main()
