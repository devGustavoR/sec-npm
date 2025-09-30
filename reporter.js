export function generateReport(analysisResults) {
  console.log("\n\n--- Relatório Final de Análise de Segurança ---");

  // Adiciona "res.analysis &&" para filtrar entradas nulas do cache
  const highRiskPackages = analysisResults.filter(
    (res) => res.analysis && res.analysis.riskScore >= 7
  );
  const mediumRiskPackages = analysisResults.filter(
    (res) =>
      res.analysis && res.analysis.riskScore >= 4 && res.analysis.riskScore < 7
  );

  if (highRiskPackages.length === 0 && mediumRiskPackages.length === 0) {
    console.log("✅ Nenhuma ameaça significativa encontrada.");
    return 0;
  }

  let maxRisk = 0;
  // ... (o resto do arquivo continua igual) ...
  if (highRiskPackages.length > 0) {
    console.log("\n🚨 PACOTES DE ALTO RISCO DETECTADOS 🚨");
    highRiskPackages.forEach(({ packageName, analysis }) => {
      if (analysis.riskScore > maxRisk) maxRisk = analysis.riskScore;
      console.log(
        `- ${packageName} (Risco: ${analysis.riskScore}/10): ${analysis.justification}`
      );
    });
  }

  if (mediumRiskPackages.length > 0) {
    console.log("\n⚠️ PACOTES DE MÉDIO RISCO DETECTADOS ⚠️");
    mediumRiskPackages.forEach(({ packageName, analysis }) => {
      if (analysis.riskScore > maxRisk) maxRisk = analysis.riskScore;
      console.log(
        `- ${packageName} (Risco: ${analysis.riskScore}/10): ${analysis.justification}`
      );
    });
  }

  return maxRisk;
}
