import { promises as fs } from "fs";
import registry from "npm-registry-fetch";
import os from "os";
import path from "path";
import * as tar from "tar";

export async function fetchPackage(packageName, packageVersion) {
  const spec = `${packageName}@${packageVersion}`;
  try {
    const manifest = await registry.json(`/${packageName}`);
    const tarballUrl = manifest.versions[packageVersion].dist.tarball;

    const res = await registry(tarballUrl);
    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), `sec-npm-${packageName}-`)
    );

    await new Promise((resolve, reject) => {
      res.body
        .pipe(tar.x({ C: tempDir, strip: 1 }))
        .on("finish", resolve)
        .on("error", reject);
    });

    return tempDir;
  } catch (error) {
    console.error(`Falha ao buscar o pacote '${spec}'. Erro:`, error.message);
    throw error;
  }
}
