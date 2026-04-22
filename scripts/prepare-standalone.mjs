import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const nextDir = path.join(rootDir, ".next");
const standaloneDir = path.join(nextDir, "standalone");
const standaloneNextDir = path.join(standaloneDir, ".next");
const serverSourceDir = path.join(nextDir, "server");
const serverTargetDir = path.join(standaloneNextDir, "server");
const staticSourceDir = path.join(nextDir, "static");
const staticTargetDir = path.join(standaloneNextDir, "static");
const publicSourceDir = path.join(rootDir, "public");
const publicTargetDir = path.join(standaloneDir, "public");
const sqliteSourceFile = path.join(rootDir, "prisma", "dev.db");
const sqliteRootTargetFile = path.join(standaloneDir, "dev.db");
const sqlitePrismaTargetFile = path.join(standaloneDir, "prisma", "dev.db");

function copyDirIfPresent(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) {
    return;
  }

  mkdirSync(targetDir, { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true, force: true });
}

function copyFileIfPresent(sourceFile, targetFile) {
  if (!existsSync(sourceFile)) {
    return;
  }

  mkdirSync(path.dirname(targetFile), { recursive: true });
  cpSync(sourceFile, targetFile, { force: true });
}

copyDirIfPresent(serverSourceDir, serverTargetDir);
copyDirIfPresent(staticSourceDir, staticTargetDir);
copyDirIfPresent(publicSourceDir, publicTargetDir);
copyFileIfPresent(sqliteSourceFile, sqliteRootTargetFile);
copyFileIfPresent(sqliteSourceFile, sqlitePrismaTargetFile);

console.log("Prepared standalone output with Next server files, static assets, public files, and SQLite data.");
