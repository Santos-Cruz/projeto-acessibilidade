
const { test, expect } = require('@playwright/test');

const { auditAccessibility } = require('../helpers/a11y');
const { saveReport } = require('../helpers/reportFormatter');

test('Auditoria da página de detalhes do produto', async ({ page }) => {

    await page.goto('/');

    // Abre o primeiro produto da lista
    await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

    // Espera o nome do produto carregar
    await expect(page.locator('.name')).toHaveText('Samsung galaxy s6');

    const results = await auditAccessibility(page);

    saveReport([results], 'detalhes-produto.json');
});

test('Auditoria do carrinho de compras', async ({ page }) => {

    await page.goto('/prod.html?idp_=1');
    await expect(page.locator('.name')).toHaveText('Samsung galaxy s6');

    // Ao adicionar, o site mostra um alerta que precisa ser aceito
    const alerta = page.waitForEvent('dialog');
    await page.getByText('Add to cart').click();
    const dialog = await alerta;
    expect(dialog.message()).toContain('Product added');
    await dialog.accept();

    // Vai para a tela do carrinho
    await page.locator('#cartur').click();
    await expect(page.locator('#tbodyid')).toContainText('Samsung galaxy s6');

    const resultsCarrinho = await auditAccessibility(page);
    saveReport([resultsCarrinho], 'carrinho.json');

    // Abre o formulário de finalizar compra
    await page.getByRole('button', { name: 'Place Order' }).click();
    await expect(page.locator('#orderModal')).toBeVisible();

    const resultsPedido = await auditAccessibility(page);
    saveReport([resultsPedido], 'finalizar-pedido.json');
});
