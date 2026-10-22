import fs from 'node:fs';
export default {
  watch: ['../../public/data/*.json'],
  load() {
    const root = new URL('../../public/data/', import.meta.url);
    const meta = JSON.parse(fs.readFileSync(new URL('meta.json', root), 'utf8'));
    const packages = JSON.parse(fs.readFileSync(new URL('packages.json', root), 'utf8')).items;
    return { counts: meta.counts, packages: packages.map(({ name, latestVersion, kind, namespace, description }) => ({ name, latestVersion, kind, namespace, description })) };
  }
};
