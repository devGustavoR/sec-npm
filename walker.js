import { promises as fs } from "fs";
import path from "path";
import { getFromCache, setToCache } from "./cache.js";
import { analyzeScript } from "./engine.js";
import { fetchPackage } from "./fetcher.js";

const processedPackages = new Set();
let analysisResults = [];

async function analyzePackage(packageName, packageVersion) {
  const spec = `${packageName}@${packageVersion}`;
  if (processedPackages.has(spec)) return;
  processedPackages.add(spec);

  const cachedResult = getFromCache(spec);
  if (cachedResult) {
    console.log(`🔎 Analisando ${spec}... (do cache)`);
    if (cachedResult.analysis) {
      analysisResults.push(cachedResult);
    }
  } else {
    // Apenas se não estiver no cache, fazemos a análise completa
    await performAnalysis(packageName, packageVersion);
  }

  // A recursão para dependências
  const tempDirForDeps = await fetchPackage(packageName, packageVersion);
  try {
    const packageJsonPath = path.join(tempDirForDeps, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
    if (packageJson.dependencies) {
      for (const [depName, depVersion] of Object.entries(
        packageJson.dependencies
      )) {
        const cleanVersion = depVersion.replace(/[^0-9.]/g, "");
        if (cleanVersion) {
          await analyzePackage(depName, cleanVersion);
        }
      }
    }
  } finally {
    await fs.rm(tempDirForDeps, { recursive: true, force: true });
  }
}

async function performAnalysis(packageName, packageVersion) {
  const spec = `${packageName}@${packageVersion}`;
  console.log(`🔎 Analisando ${spec}... (nova análise)`);
  let extractedPath = "";
  let analysisPerformed = false;
  try {
    extractedPath = await fetchPackage(packageName, packageVersion);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const packageJsonPath = path.join(extractedPath, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));

    const scriptsToAnalyze = new Map();
    if (packageJson.scripts) {
      ["postinstall", "install", "preinstall"].forEach((name) => {
        if (packageJson.scripts[name])
          scriptsToAnalyze.set(name, packageJson.scripts[name]);
      });
    }
    if (packageJson.main)
      scriptsToAnalyze.set("main", `node ${packageJson.main}`);

    for (const [scriptType, scriptCommand] of scriptsToAnalyze.entries()) {
      const scriptFileName = scriptCommand
        .split(" ")
        .find((part) => part.endsWith(".js"));
      if (scriptFileName) {
        const scriptPath = path.join(extractedPath, scriptFileName);
        try {
          const scriptContent = await fs.readFile(scriptPath, "utf-8");
          const analysis = await analyzeScript(scriptContent);
          const result = { packageName: spec, scriptType, analysis };
          analysisResults.push(result);
          setToCache(spec, result);
          analysisPerformed = true;
          break;
        } catch {}
      }
    }
    if (!analysisPerformed) {
      setToCache(spec, { packageName: spec, analysis: null });
    }
  } finally {
    if (extractedPath) {
      await fs.rm(extractedPath, { recursive: true, force: true });
    }
  }
}

export async function startAnalysis(rootPackageName) {
  analysisResults = []; // Limpa os resultados para uma nova execução
  const rootManifest = await import("npm-registry-fetch").then((mod) =>
    mod.default.json(`/${rootPackageName}`)
  );
  const rootVersion = rootManifest["dist-tags"].latest;

  await analyzePackage(rootPackageName, rootVersion);
  return analysisResults;
}
