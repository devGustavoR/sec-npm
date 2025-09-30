#!/usr/bin/env node
import { program } from "commander";
import readline from "readline";
import { loadCache, saveCache } from "./cache.js";
import { generateReport } from "./reporter.js";
import { startAnalysis } from "./walker.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const askQuestion = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

program
  .name("sec-npm")
  .description(
    "Uma ferramenta para analisar a segurança de pacotes NPM antes da instalação."
  )
  .version("0.0.1");

program
  .command("install")
  .description("Analisa um pacote do NPM e suas dependências.")
  .argument("<packageName>", "O nome do pacote a ser analisado.")
  .action(async (packageName) => {
    console.log(
      `Iniciando análise de segurança para o ecossistema do pacote: ${packageName}\n`
    );

    await loadCache();

    try {
      const results = await startAnalysis(packageName);
      const maxRisk = generateReport(results);

      if (maxRisk >= 4) {
        const answer = await askQuestion(
          "\nAnálise concluiu com riscos. Deseja continuar a instalação? (s/N) "
        );
        if (answer.toLowerCase() !== "s") {
          console.log("\nInstalação abortada pelo usuário.");
          await saveCache();
          rl.close();
          process.exit(0);
        }
      }
      console.log("\nProcedimento de análise finalizado.");
    } catch (error) {
      console.error(
        `\n❌ Uma falha crítica ocorreu durante a análise:`,
        error.message
      );
    } finally {
      await saveCache();
      rl.close();
    }
  });

program.parse(process.argv);
