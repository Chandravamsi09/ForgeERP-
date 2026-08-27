const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Creating 100% compliant TrainPlex ZIP archive with full .git history...');

const STAGING_DIR = path.resolve(__dirname, '../_staging_repo');
const ZIP_OUTPUT = path.resolve(__dirname, '../ForgeERP-TrainPlex-100-Ready.zip');

// Clean existing
if (fs.existsSync(STAGING_DIR)) {
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
}
if (fs.existsSync(ZIP_OUTPUT)) {
  fs.unlinkSync(ZIP_OUTPUT);
}

fs.mkdirSync(STAGING_DIR, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    const base = path.basename(src);
    if (['node_modules', 'dist', 'build', 'coverage', '.gemini', 'scratch', '_staging_repo'].includes(base)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    const filename = path.basename(src);
    // Strictly exclude any .env file except example.env
    if (filename === '.env' || filename.startsWith('.env.') || src.endsWith('.db') || src.endsWith('.zip') || src.endsWith('.log')) {
      return;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

const ROOT = path.resolve(__dirname, '..');
const items = fs.readdirSync(ROOT);

for (const item of items) {
  if (['node_modules', 'dist', 'build', 'coverage', '.gemini', 'scratch', '_staging_repo'].includes(item)) continue;
  if (item === '.env' || item.startsWith('.env.') || item.endsWith('.zip') || item.endsWith('.db')) continue;
  const srcPath = path.join(ROOT, item);
  const destPath = path.join(STAGING_DIR, item);
  console.log('Including in archive:', item);
  copyRecursive(srcPath, destPath);
}

console.log('Compressing staging directory to ZIP...');
// Using Compress-Archive with hidden item support
execSync(`powershell -Command "Get-ChildItem -Path '${STAGING_DIR}' -Force | Compress-Archive -DestinationPath '${ZIP_OUTPUT}' -Force"`, {
  stdio: 'inherit',
});

// Cleanup staging
fs.rmSync(STAGING_DIR, { recursive: true, force: true });

const finalStat = fs.statSync(ZIP_OUTPUT);
console.log('🎉 ZIP created successfully!');
console.log('Location:', ZIP_OUTPUT);
console.log('File size:', (finalStat.size / 1024 / 1024).toFixed(2), 'MB');
