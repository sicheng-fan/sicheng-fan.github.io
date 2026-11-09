#!/usr/bin/env python3
"""Package a verified Linux standalone build without deployment state."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile


def digest(path):
    value = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            value.update(chunk)
    return value.hexdigest()


def excluded(relative):
    parts = relative.parts
    return (parts[:1] == ('data',) or any(
        name.startswith('.env') or name in {
            'analytics.json', '.git', '.ssh', '.codex', '.agents',
            'DEPLOYMENT.local.md', 'HOW_GIT_FOLDER_WORKS.md', 'SYNC_WORKFLOW_GUIDE.md',
        } or name.endswith(('.local', '.local.md', '.pem', '.key', '.p12'))
        for name in parts))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--project', required=True, type=Path)
    parser.add_argument('--commit', required=True)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    project, output = args.project.resolve(), args.output.resolve()
    assert re.fullmatch('[0-9a-f]{40}', args.commit), 'Expected a full commit SHA'
    actual = subprocess.check_output(['git', '-C', str(project), 'rev-parse', 'HEAD'], text=True).strip()
    assert actual == args.commit, 'Source commit mismatch'
    subprocess.run(['git', '-C', str(project), 'diff', '--exit-code', 'HEAD', '--'], check=True)
    runtime = json.loads(subprocess.check_output(['node', '-p',
        'JSON.stringify({node:process.version,platform:process.platform,arch:process.arch,'
        'glibc:process.report.getReport().header.glibcVersionRuntime})'], text=True))
    assert runtime['platform'] == 'linux' and runtime['arch'] == 'x64', runtime
    assert runtime['node'] == 'v18.20.8', runtime
    assert runtime.get('glibc'), 'Expected glibc Linux'

    standalone = project / '.next/standalone'
    for name in ['server.js', 'package.json', '.next/BUILD_ID', '.next/routes-manifest.json']:
        assert (standalone / name).is_file(), 'Missing standalone file: ' + name
    for name in ['node_modules', 'public', '.next/static', '.next/server']:
        assert (standalone / name).is_dir(), 'Missing standalone directory: ' + name
    build_id = project / '.next/BUILD_ID'
    assert build_id.read_bytes() == (standalone / '.next/BUILD_ID').read_bytes()

    # Static HTML/API responses alone cannot prove that traced content is present.
    expected_content = []
    for directory in ['content/blog', 'content/projects', 'public', 'resources/geoip']:
        for source in sorted((project / directory).rglob('*')):
            if source.is_file() and (directory in {'public', 'resources/geoip'} or source.suffix in {'.md', '.mdx'}):
                relative = source.relative_to(project)
                target = standalone / relative
                assert target.is_file() and digest(source) == digest(target), 'Missing/different asset: ' + str(relative)
                if directory != 'public':
                    expected_content.append(str(relative))

    entries = [(build_id, '.next/BUILD_ID')]
    for path in sorted(standalone.rglob('*')):
        relative = path.relative_to(standalone)
        if excluded(relative) or (path.is_dir() and not path.is_symlink()):
            continue
        assert path.is_file() or path.is_symlink(), 'Unexpected special file: ' + str(relative)
        if path.is_symlink():
            target = os.readlink(path)
            resolved = path.resolve(strict=True)
            assert not os.path.isabs(target) and standalone in resolved.parents, 'External symlink: ' + str(relative)
            assert not excluded(resolved.relative_to(standalone)), 'Link to excluded state: ' + str(relative)
        if path.suffix == '.node':
            with path.open('rb') as stream:
                header = stream.read(20)
            assert header[:4] == b'\x7fELF' and header[4] == 2 and header[18:20] == b'>\x00', 'Non-Linux-x64 native module: ' + str(relative)
        entries.append((path, '.next/standalone/' + relative.as_posix()))

    manifest = {'source_commit': actual, 'runtime': runtime,
                'build_id': build_id.read_text().strip(), 'content_files': expected_content,
                'files': {name: ({'symlink': os.readlink(path)} if path.is_symlink() else
                                {'sha256': digest(path), 'bytes': path.stat().st_size})
                          for path, name in entries}}
    output.mkdir(parents=True, exist_ok=True)
    assert not list(output.iterdir()), 'Output directory must be empty'
    manifest_file = output / 'server-artifact.json'
    manifest_file.write_text(json.dumps(manifest, indent=2, sort_keys=True) + '\n')
    archive = output / 'server-linux-x64.tar.gz'
    with tarfile.open(archive, 'w:gz', dereference=False) as tar:
        for path, name in entries:
            tar.add(path, arcname=name, recursive=False)
        tar.add(manifest_file, arcname='.next/server-artifact.json', recursive=False)
    (output / 'server-linux-x64.tar.gz.sha256').write_text(digest(archive) + '  ' + archive.name + '\n')
    print('Packaged {} files for {}: {} bytes; no runtime data or environment files'.format(
        len(entries), actual, archive.stat().st_size))


if __name__ == '__main__':
    main()
