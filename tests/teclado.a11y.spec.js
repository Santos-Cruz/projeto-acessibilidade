
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const { auditAccessibility } = require('../helpers/a11y');
const { saveReport } = require('../helpers/reportFormatter');

// Pega o texto e o estilo de foco do elemento que está focado
async function elementoFocado(page) {
    return page.evaluate(() => {
        const el = document.activeElement;
        const estilo = getComputedStyle(el);

        return {
            texto: el.textContent.trim(),
            outline: estilo.outlineStyle,
            sombra: estilo.boxShadow
        };
    });
}

test('Navegação pela barra de navegação usando Tab', async ({ page }) => {

    await page.goto('/');
    await page.waitForSelector('#tbodyid .card');

    // Ordem que os links devem receber o foco
    const ordemEsperada = [
        'PRODUCT STORE',
        'Home (current)',
        'Contact',
        'About us',
        'Cart',
        'Log in',
        'Sign up'
    ];

    for (const texto of ordemEsperada) {
        await page.keyboard.press('Tab');
        const focado = await elementoFocado(page);
        expect(focado.texto).toBe(texto);
    }
});

test('Verificação do foco visível', async ({ page }) => {

    await page.goto('/');
    await page.waitForSelector('#tbodyid .card');

    const semFoco = [];

    // Passa pelos 12 primeiros elementos com Tab
    for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
        const focado = await elementoFocado(page);

        // Se não tem contorno nem sombra, o usuário não vê onde está o foco
        if (focado.outline === 'none' && focado.sombra === 'none') {
            semFoco.push(focado.texto);
        }
    }

    console.log('Elementos sem foco visível:', semFoco);

    // Salva o resultado junto com os outros relatórios
    const pasta = path.join(__dirname, '..', 'reports');
    fs.mkdirSync(pasta, { recursive: true });
    fs.writeFileSync(
        path.join(pasta, 'foco-visivel.json'),
        JSON.stringify({
            dataGeracao: new Date().toISOString(),
            criterio: '2.4.7 Foco Visível',
            elementosSemFoco: semFoco
        }, null, 2),
        'utf8'
    );
});

test('Abrir e fechar o modal de Login com o teclado', async ({ page }) => {

    await page.goto('/');
    await page.waitForSelector('#tbodyid .card');

    // Coloca o foco no link Log in e aperta Enter
    await page.locator('#login2').focus();
    await page.keyboard.press('Enter');

    const modal = page.locator('#logInModal');
    await expect(modal).toBeVisible();

    // Audita a página com o modal aberto
    const results = await auditAccessibility(page);
    saveReport([results], 'modal-login.json');

    // Fecha o modal com a tecla Escape
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
});
