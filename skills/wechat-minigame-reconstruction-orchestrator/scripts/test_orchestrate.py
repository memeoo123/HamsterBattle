#!/usr/bin/env python3
"""Regression tests for orchestration acceptance levels and stale checks."""

from __future__ import annotations

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("orchestrate.py")
SPEC = importlib.util.spec_from_file_location("orchestrate", MODULE_PATH)
assert SPEC and SPEC.loader
orchestrate = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(orchestrate)


class OrchestrationTests(unittest.TestCase):
    def setUp(self) -> None:
        orchestrate.clear_fingerprint_cache()
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.project = self.root / "cocosProject"
        (self.project / "assets").mkdir(parents=True)
        (self.project / "package.json").write_text(
            json.dumps({"creator": {"version": "3.8.8"}}), encoding="utf-8"
        )
        (self.project / "assets" / "Game.ts").write_text("export const value = 1;\n", encoding="utf-8")
        self.golden = self.root / "golden-cases.json"
        self.golden.write_text("{}\n", encoding="utf-8")
        self.restore = self.root / "RESTORE_SPEC.json"
        self.restore.write_text(
            json.dumps({"schemaVersion": "1.0", "implementationReady": True, "unknowns": []}),
            encoding="utf-8",
        )
        self.report = self.root / "VALIDATION_REPORT.md"
        self.report.write_text("validated\n", encoding="utf-8")
        self.reference = self.root / "original.json"
        self.reference.write_text("{}\n", encoding="utf-8")
        self.battlefield = self.root / "BATTLEFIELD_RESTORE_STATE.json"
        self.battlefield.write_text(
            json.dumps({"schemaVersion": "1.0", "completionClaim": "incomplete"}),
            encoding="utf-8",
        )
        self.target = {
            "phase": "complete",
            "status": "complete",
            "platform": "windows",
            "engine": "cocos",
            "acceptanceTarget": "functional-complete",
            "authorization": {"status": "confirmed"},
            "artifacts": {},
            "checks": {},
            "history": [],
        }
        for kind, path in {
            "cocosProject": self.project,
            "goldenCases": self.golden,
            "restoreSpec": self.restore,
            "validationReport": self.report,
            "originalReference": self.reference,
            "battlefieldState": self.battlefield,
        }.items():
            self.target["artifacts"][kind] = {"path": str(path)}

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def pass_check(self, name: str) -> None:
        dependencies = {
            kind: orchestrate.artifact_fingerprint(self.target, kind)
            for kind in orchestrate.DEFAULT_CHECK_DEPENDENCIES.get(name, ())
            if orchestrate.artifact_exists(self.target, kind)
        }
        self.target["checks"][name] = {
            "result": "pass",
            "evidence": "test",
            "dependencies": dependencies,
            "atUtc": orchestrate.now(),
        }

    def pass_functional_checks(self) -> None:
        for name in orchestrate.FUNCTIONAL_CHECKS:
            self.pass_check(name)

    def write_representative_battlefield(self, faithful: bool = False) -> None:
        validation = "replay-pass" if faithful else "integration-pass"
        state = {
            "schemaVersion": "1.0",
            "completionClaim": "battlefield-faithful" if faithful else "representative-level",
            "subsystems": {
                "required": {
                    "scope": "required",
                    "evidenceStatus": "confirmed",
                    "implementationStatus": "implemented",
                    "validationStatus": validation,
                    "evidence": ["original.json"],
                    "unknowns": [],
                    "tests": ["test"],
                }
            },
            "gates": {
                "evidence": {"status": "pass"},
                "deterministic": {"status": "pass"},
                "integration": {"status": "pass"},
                "matchedReplay": {"status": "pass" if faithful else "pending"},
            },
            "blockers": [],
        }
        self.battlefield.write_text(json.dumps(state), encoding="utf-8")
        orchestrate.clear_fingerprint_cache()

    def test_functional_completion_does_not_claim_battlefield(self) -> None:
        self.pass_functional_checks()
        self.assertEqual(orchestrate.completion_level(self.target), "functional-complete")
        self.assertEqual(orchestrate.blockers(self.target), [])

    def test_changed_source_makes_dependent_checks_stale(self) -> None:
        self.pass_functional_checks()
        (self.project / "assets" / "Game.ts").write_text("export const value = 200;\n", encoding="utf-8")
        orchestrate.clear_fingerprint_cache()
        stale = orchestrate.stale_checks(self.target)
        self.assertIn("mechanicsData", stale)
        self.assertIn("typescript", stale)
        self.assertIn("assetImport", stale)
        self.assertIn("check:typescript", orchestrate.blockers(self.target))

    def test_representative_level_requires_supported_battlefield_claim(self) -> None:
        self.pass_functional_checks()
        self.pass_check("visualBaseline")
        self.target["acceptanceTarget"] = "representative-level"
        self.assertIn("battlefield:representative-level", orchestrate.blockers(self.target))
        self.write_representative_battlefield()
        self.pass_check("mechanicsData")
        self.pass_check("visualBaseline")
        self.assertEqual(orchestrate.blockers(self.target), [])
        self.assertEqual(orchestrate.completion_level(self.target), "representative-level")

    def test_faithful_target_rejects_representative_claim(self) -> None:
        self.pass_functional_checks()
        self.write_representative_battlefield()
        self.pass_check("mechanicsData")
        self.pass_check("visualBaseline")
        self.target["acceptanceTarget"] = "battlefield-faithful"
        self.assertIn("battlefield:battlefield-faithful", orchestrate.blockers(self.target))

    def test_legacy_pass_without_dependencies_is_stale(self) -> None:
        self.target["checks"]["typescript"] = {"result": "pass", "evidence": "legacy"}
        self.assertEqual(
            orchestrate.check_stale_reason(self.target, "typescript"),
            "dependency fingerprints were not recorded",
        )


if __name__ == "__main__":
    unittest.main()
