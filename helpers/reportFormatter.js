
const fs = require('fs');
const path = require('path');

// Organiza as violações encontradas nos testes
function formatViolations(results) {
    const violations = results.flatMap(result =>
        (result.violations || []).map(violation => ({
            id: violation.id,
            impact: violation.impact,
            description: violation.description,
            help: violation.help,
            helpUrl: violation.helpUrl,

            elementosAfetados: (violation.nodes || []).map(node => ({
                elemento: node.html,
                localizacao: node.target,
                problema: node.failureSummary
            }))
        }))
    );

    return {
        dataGeracao: new Date().toISOString(),
        totalViolacoes: violations.length,
        totalElementosAfetados: violations.reduce(
            (total, item) => total + item.elementosAfetados.length,
            0
        ),
        violacoes: violations
    };
}

// Salva um relatório individual
function saveReport(results, nomeArquivo = 'wcag-summary.json') {
    const report = formatViolations(results);

    const pasta = path.join(__dirname, '..', 'reports');

    fs.mkdirSync(pasta, { recursive: true });

    const arquivo = path.join(pasta, nomeArquivo);

    fs.writeFileSync(
        arquivo,
        JSON.stringify(report, null, 2),
        'utf8'
    );

    console.log('Relatório de acessibilidade gerado!');
    console.log(`Total de violações: ${report.totalViolacoes}`);
    console.log(`Arquivo salvo em: ${arquivo}`);

    return report;
}

module.exports = {
    formatViolations,
    saveReport
};
