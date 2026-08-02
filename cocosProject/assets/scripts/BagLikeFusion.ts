export type BagLikeHeroStars = Readonly<Record<string, number>>;

export type BagLikeFusionRecipe = {
    resultId: string;
    materials: readonly [string, string];
    heroStarRequirements: Readonly<Record<string, number>>;
};

// Exact BagLikeItemConfig level-5 recipes. Material order is irrelevant in the
// original runtime, so resolution checks both directions.
export const BAGLIKE_LEVEL5_FUSIONS: readonly BagLikeFusionRecipe[] = [
    { resultId: 'H0705', materials: ['H0104', 'H0204'], heroStarRequirements: { H01: 2, H02: 2 } },
    { resultId: 'H0805', materials: ['H0304', 'H1204'], heroStarRequirements: { H03: 3, H12: 3 } },
    { resultId: 'H0905', materials: ['H0404', 'H1304'], heroStarRequirements: { H04: 5, H13: 5 } },
    { resultId: 'H1005', materials: ['H0504', 'H0604'], heroStarRequirements: { H05: 5, H06: 5 } },
    { resultId: 'H1505', materials: ['H1404', 'C04'], heroStarRequirements: { H14: 5 } },
    { resultId: 'H1805', materials: ['H1604', 'H1704'], heroStarRequirements: { H16: 5, H17: 5 } },
] as const;

export function bagLikeFusionRecipe(materialA: string, materialB: string): BagLikeFusionRecipe | null {
    return BAGLIKE_LEVEL5_FUSIONS.find((recipe) => {
        const [first, second] = recipe.materials;
        return (materialA === first && materialB === second) || (materialA === second && materialB === first);
    }) || null;
}

export function bagLikeFusionRequirementsMet(
    recipe: BagLikeFusionRecipe,
    heroStars: BagLikeHeroStars,
): boolean {
    return Object.keys(recipe.heroStarRequirements).every((heroId) => (
        (heroStars[heroId] || 0) >= recipe.heroStarRequirements[heroId]
    ));
}

export function resolveBagLikeFusion(
    materialA: string,
    materialB: string,
    heroStars: BagLikeHeroStars,
): string | null {
    const recipe = bagLikeFusionRecipe(materialA, materialB);
    return recipe && bagLikeFusionRequirementsMet(recipe, heroStars) ? recipe.resultId : null;
}
