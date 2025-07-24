#!/usr/bin/env node
import 'dotenv/config';
import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handleInitCommand = () => {
  const initIndex = process.argv.indexOf('--init');
  if (initIndex === -1) return false; // Not an init command

  const templateName = process.argv[initIndex + 1];
  const templatesDir = path.join(__dirname, '..', 'templates');
  const targetPath = path.join(process.cwd(), '.dev-dashboard.yaml');

  if (fs.existsSync(targetPath)) {
    console.error('Error: .dev-dashboard.yaml already exists in this directory. Please remove it first.');
    process.exit(1);
  }

  if (!templateName) {
    // List available templates
    const available = fs.readdirSync(templatesDir).map(f => f.replace('.yaml', ''));
    console.log('Available templates:');
    available.forEach(t => console.log(`- ${t}`));
    process.exit(0);
  }

  const sourcePath = path.join(templatesDir, `${templateName}.yaml`);
  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: Template "${templateName}" not found.`);
    process.exit(1);
  }

  fs.copyFileSync(sourcePath, targetPath);
  console.log(`✅ Successfully created .dev-dashboard.yaml from the "${templateName}" template.`);
  process.exit(0);
};

// Run this before any server logic
handleInitCommand();

// figure out which project to serve
const argvRoot = process.argv.find(a => a.startsWith('--project-root=')) || '';
const PROJECT_ROOT = argvRoot ? argvRoot.split('=')[1] : process.cwd();
const CONFIG_PATH = path.join(PROJECT_ROOT, '.dev-dashboard.yaml');

let project = {}, workflows = {}, components = {}, groups = {};
try {
  const yamlText = fs.readFileSync(CONFIG_PATH, 'utf8');
  const raw = yaml.load(yamlText) || {};
  project    = raw.project           || {};
  workflows  = raw.workflows         || {};
  components = raw.components        || {};
  groups     = raw['workflow-groups']|| {};
  console.log(`Loaded workflows (${Object.keys(workflows).length}) from ${CONFIG_PATH}`);
} catch (e) {
  console.warn(`No .dev-dashboard.yaml found in ${PROJECT_ROOT}`);
}

const app = express();
const PORT = project.port || process.env.PORT || 3334;
const STATIC_ROOT = path.join(__dirname);

app.use(express.static(STATIC_ROOT));

// expose config to UI
app.get('/config', (_, res) => res.json({ project, workflows, components, groups }));

app.get('/run', (req, res) => {
  const cmd = req.query.cmd;
  if (!cmd) return res.status(400).send('Missing cmd query param');
  const child = exec(cmd, { cwd: process.cwd() });

  if (req.query.log === 'true') {
    const logStream = fs.createWriteStream(path.join(PROJECT_ROOT, 'dev-dashboard.log'), { flags: 'a' });
    child.stdout.pipe(logStream, { end: false });
    child.stderr.pipe(logStream, { end: false });
  }

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  child.stdout.pipe(res, { end: false });
  child.stderr.pipe(res, { end: false });
  child.on('close', () => res.end());
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () =>
    console.log(`Dev Dashboard listening → http://localhost:${PORT}`)
  );
}

export default app;
