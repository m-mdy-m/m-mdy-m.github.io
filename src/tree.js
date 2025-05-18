export function buildVirtualFS(entries) {
  const tree = {};

  for (const entry of entries) {
    const relPath = entry.file.replace('/src/content/', '').replace(/\.md$/, '');
    const parts = relPath.split('/');

    let current = tree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (!current[part]) {
        current[part] = isLast ? { __file: true, ...entry } : {};
      }

      current = current[part];
    }
  }

  return tree;
}
