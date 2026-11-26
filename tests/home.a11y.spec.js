
const { test } = require('@playwright/test');

const { auditAccessibility } = require('../helpers/a11y');
const { saveReport } = require('../helpers/reportFormatter');

test('Auditoria de acessibilidade da página inicial', async ({ page }) => {

    // Acessa o site Demoblaze
    await page.goto('https://www.demoblaze.com/');

    // Aguarda o carregamento da página
    await page.waitForLoadState('domcontentloaded');

    // Espera os produtos aparecerem, senão o Axe analisa a página incompleta
    await page.waitForSelector('#tbodyid .card');

    // Executa a auditoria de acessibilidade
    const results = await auditAccessibility(page);

    // Salva as violações encontradas em JSON
    saveReport([results]);

    console.log('Teste da página inicial finalizado!');
});
