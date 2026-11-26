
const { test, expect } = require('@playwright/test');

const { auditAccessibility } = require('../helpers/a11y');
const { saveReport } = require('../helpers/reportFormatter');

test('Auditoria da barra de navegação e do carrossel', async ({ page }) => {

    await page.goto('/');

    // Espera os produtos aparecerem na tela
    await page.waitForSelector('#tbodyid .card');

    // Confere se os links da barra de navegação estão visíveis
    const menu = page.locator('#navbarExample');
    await expect(menu.getByText('Home')).toBeVisible();
    await expect(menu.getByText('Contact')).toBeVisible();
    await expect(menu.getByText('About us')).toBeVisible();
    await expect(menu.getByText('Cart')).toBeVisible();
    await expect(menu.getByText('Log in')).toBeVisible();
    await expect(menu.getByText('Sign up')).toBeVisible();

    // Passa para a próxima imagem do carrossel
    await page.locator('.carousel-control-next').click();
    await page.waitForTimeout(1000);

    const results = await auditAccessibility(page);

    saveReport([results], 'navegacao-carrossel.json');
});

test('Auditoria do filtro de categorias', async ({ page }) => {

    await page.goto('/');
    await page.waitForSelector('#tbodyid .card');

    // Filtra pela categoria Laptops
    await page.getByText('Laptops').click();

    // Confere se apareceu um notebook na lista
    await expect(page.locator('#tbodyid')).toContainText('MacBook air');

    const results = await auditAccessibility(page);

    saveReport([results], 'categorias.json');
});
