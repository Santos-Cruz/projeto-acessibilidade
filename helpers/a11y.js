
const AxeBuilder = require('@axe-core/playwright');

// Executa a verificação de acessibilidade
async function checkAccessibility(page) {
    const results = await new AxeBuilder({ page })
        .withTags([
            'wcag2a',
            'wcag2aa',
            'wcag21a',
            'wcag21aa',
            'wcag22aa'
        ])
        .analyze();

    return results;
}

// Analisa e apresenta as violações encontradas
async function auditAccessibility(page) {
    const results = await checkAccessibility(page);

    console.log('Auditoria de acessibilidade concluída!');
    console.log(`Violações encontradas: ${results.violations.length}`);

    for (const violation of results.violations) {
        console.log(`Regra: ${violation.id}`);
        console.log(`Impacto: ${violation.impact}`);
        console.log(`Descrição: ${violation.description}`);
    }

    return results;
}

module.exports = {
    checkAccessibility,
    auditAccessibility
};
