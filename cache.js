import { promises as fs } from "fs";
import os from "os";
import path from "path";

const CACHE_DIR = path.join(os.homedir(), ".sec-npm");
const CACHE_FILE_PATH = path.join(CACHE_DIR, "analysis-cache.json");

let cacheData = null;

async function ensureCacheDirExists() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}

export async function loadCache() {
  await ensureCacheDirExists();
  try {
    const fileContent = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    cacheData = JSON.parse(fileContent);
  } catch (error) {
    // Se o arquivo não existe ou está corrompido, começa com um cache vazio
    cacheData = {};
  }
  return cacheData;
}

export async function saveCache() {
  if (cacheData !== null) {
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2));
  }
}

export function getFromCache(key) {
  return cacheData ? cacheData[key] : null;
}

export function setToCache(key, value) {
  if (cacheData) {
    cacheData[key] = value;
  }
}
