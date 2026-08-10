import assert from 'node:assert/strict';
import {
    bagLikeFusionActiveProfile,
    bagLikeFusionPrimaryBulletProfile,
    bagLikeH15KillCoins,
    bagLikeH15RoundEndCoins,
    crossedBagLikeFusionActiveSteps,
    H10_NUKE_PROFILE,
    H10_PRIMARY_BULLET_PROFILE,
    H18_BREATH_PROFILE,
} from '../assets/scripts/BagLikeFusionHeroMechanics.ts';

assert.equal(bagLikeFusionActiveProfile('H10'), H10_NUKE_PROFILE);
assert.equal(bagLikeFusionActiveProfile('H18'), H18_BREATH_PROFILE);
assert.equal(bagLikeFusionActiveProfile('H15'), null, 'H15 is a produced wheel cast rather than a persistent active-skill unit');
assert.deepEqual(H10_NUKE_PROFILE.steps.map((step) => [step.delaySeconds, step.effectRatio]), [
    [1, 1000], [2, 1000], [3, 1000], [4, 1000], [5, 1000],
]);
assert.deepEqual(H18_BREATH_PROFILE.steps.map((step) => [step.delaySeconds, step.effectRatio]), [
    [0.2, 10000], [0.4, 12000], [0.6, 12000], [0.8, 14000], [1, 16000], [1.2, 18000],
]);
assert.deepEqual(
    crossedBagLikeFusionActiveSteps(H18_BREATH_PROFILE, 0.39, 0.81),
    H18_BREATH_PROFILE.steps.slice(1, 4),
    'large frames emit every crossed breath step in source order',
);
assert.equal(bagLikeH15KillCoins('H15', true), 1);
assert.equal(bagLikeH15KillCoins('H14', true), 0);
assert.equal(bagLikeH15KillCoins('H15', false), 0);
assert.equal(bagLikeH15RoundEndCoins(['P01', 'H1505', 'H0101', 'H1505']), 32);
assert.equal(bagLikeFusionPrimaryBulletProfile('H10'), H10_PRIMARY_BULLET_PROFILE);
assert.equal(bagLikeFusionPrimaryBulletProfile('H18'), null);
assert.deepEqual(
    [
        H10_PRIMARY_BULLET_PROFILE.behaviorDelaySeconds,
        H10_PRIMARY_BULLET_PROFILE.launchOffsetX,
        H10_PRIMARY_BULLET_PROFILE.launchOffsetY,
        H10_PRIMARY_BULLET_PROFILE.speed,
        H10_PRIMARY_BULLET_PROFILE.stopShortDistance,
    ],
    [0.3, 0, 50, 1000, 20],
    'type 11 launches from SkillConfig.atkPoint and falls through to the fixed-direction default BulletUnit',
);
assert.deepEqual(
    [H10_PRIMARY_BULLET_PROFILE.effectRatio, H10_PRIMARY_BULLET_PROFILE.width, H10_PRIMARY_BULLET_PROFILE.height],
    [5000, 100, 300],
);
assert.deepEqual(H10_PRIMARY_BULLET_PROFILE.ignoredMissileFields, {
    distance: 500,
    timeLimit: 4000,
    visualWidth: 600,
    interval: 1000,
    autoLock: 600,
}, 'version-18 default BulletUnit does not consume these MissileConfig fields');

console.log('baglike fusion heroes: 15 assertions passed');
