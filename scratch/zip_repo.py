import os
import zipfile

zip_filename = 'ForgeERP-100-Percent-Pass.zip'
if os.path.exists(zip_filename):
    os.remove(zip_filename)

root_dir = os.path.abspath('.')

exclude_dirs = {'node_modules', 'dist', 'build', 'coverage', '.gemini', 'scratch', '_staging_repo'}
exclude_files = {'dev.db', '.env'}

print('Starting Python zipfile creation...')
count = 0
with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(root_dir):
        # Modify dirs in-place to skip excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file in exclude_files or file.endswith('.db') or file.endswith('.zip') or file.endswith('.log'):
                continue
            if file == '.env' or (file.startswith('.env.') and file != 'example.env'):
                continue
            
            abs_path = os.path.join(root, file)
            rel_path = os.path.relpath(abs_path, root_dir)
            
            # POSIX forward slashes for universal Linux/TrainPlex zip compatibility
            zip_rel_path = rel_path.replace(os.sep, '/')
            zipf.write(abs_path, zip_rel_path)
            count += 1

print(f'Done! Added {count} files.')

with zipfile.ZipFile(zip_filename, 'r') as zipf:
    names = zipf.namelist()
    git_files = [n for n in names if n.startswith('.git/')]
    print('Total entries in zip:', len(names))
    print('Total .git entries in zip:', len(git_files))
    print('Sample .git files:', git_files[:5])
    print('Has .git/HEAD:', '.git/HEAD' in names)
    print('Has .git/config:', '.git/config' in names)
    print('Has package.json:', 'package.json' in names)
    print('Has README.md:', 'README.md' in names)
    print('Has example.env:', 'example.env' in names)

stat = os.stat(zip_filename)
print(f'Final ZIP size: {stat.st_size / (1024 * 1024):.2f} MB')
