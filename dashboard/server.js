#!/usr/bin/env node
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs   = require('fs');
const yaml = require('js-yaml');

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
const PORT = process.env.PORT || 3333;
const STATIC_ROOT = path.join(__dirname);

app.use(express.static(STATIC_ROOT));

// expose config to UI
app.get('/config', (_, res) => res.json({ project, workflows, components, groups }));

app.get('/run', (req, res) => {
  const cmd = req.query.cmd;
  if (!cmd) return res.status(400).send('Missing cmd query param');
  const child = exec(cmd, { cwd: process.cwd() });

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  child.stdout.pipe(res, { end: false });
  child.stderr.pipe(res, { end: false });
  child.on('close', () => res.end());
});

app.listen(PORT, () =>
  console.log(`Dev Dashboard listening → http://localhost:${PORT}`)
);
