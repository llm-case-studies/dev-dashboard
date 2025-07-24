import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const load = (p) => yaml.load(fs.readFileSync(p, 'utf8'));

describe('YAML workflow schema', () => {
  const legacy = load(path.join(__dirname, '..', 'templates', 'python.yaml'));
  const advanced = load(path.join(__dirname, '..', 'examples', 'advanced', '.dev-dashboard.yaml'));

  test('legacy template has workflows', () => {
    expect(legacy.workflows).toBeDefined();
    expect(Object.keys(legacy.workflows).length).toBeGreaterThan(0);
  });

  test('advanced template exposes new keys', () => {
    expect(advanced.components).toBeDefined();
    expect(advanced['workflow-groups']).toBeDefined();
    expect(advanced.workflows['env-mode'].type).toBe('radio-group');
  });
});