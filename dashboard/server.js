#!/usr/bin/env node
const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3333;
const STATIC_ROOT = path.join(__dirname);

app.use(express.static(STATIC_ROOT));

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
