
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    // Pasta onde ficam os testes
    testDir: './tests',

    // O site às vezes demora para carregar
    timeout: 60000,

    reporter: [
        ['list'],
        ['html', { open: 'never' }]
    ],

    use: {
        baseURL: 'https://www.demoblaze.com/',
        screenshot: 'only-on-failure'
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ]
});
