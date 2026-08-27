const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const ROOT_DIR = path.resolve(__dirname, '..');
const ZIP_OUTPUT = path.join(ROOT_DIR, 'ForgeERP-100-Percent-Pass.zip');

if (fs.existsSync(ZIP_OUTPUT)) {
  fs.unlinkSync(ZIP_OUTPUT);
}

const output = fs.createWriteStream(ZIP_OUTPUT);
const archive = new archiver.ZipArchive({
  zlib: { level: 9 }, // Maximum compression
});

output.on('close', () => {
  const sizeMb = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`🎉 ZIP created successfully! Total Bytes: ${archive.pointer()} (${sizeMb} MB)`);
  console.log(`Output file: ${ZIP_OUTPUT}`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

const EXCLUDE_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.gemini',
  'scratch',
  '_staging_repo',
]);

const EXCLUDE_FILES = new Set(['dev.db', '.env']);

let fileCount = 0;
let gitFileCount = 0;

function walkAndAdd(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/'); // POSIX forward slashes for TrainPlex / Linux

    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      walkAndAdd(fullPath);
    } else if (entry.isFile()) {
      if (EXCLUDE_FILES.has(entry.name)) continue;
      if (entry.name.startsWith('.env.') && entry.name !== 'example.env') continue;
      if (entry.name.endsWith('.db') || entry.name.endsWith('.zip') || entry.name.endsWith('.log')) continue;

      archive.file(fullPath, { name: relPath });
      fileCount++;
      if (relPath.startsWith('.git/')) {
        gitFileCount++;
      }
    }
  }
}

console.log('Archiving complete repository including .git directory...');
walkAndAdd(ROOT_DIR);

console.log(`Total files queued: ${fileCount} (including ${gitFileCount} .git repository files)`);
archive.finalize();
