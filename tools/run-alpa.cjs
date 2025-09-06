#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function unquote(s){
  if(!s) return '';
  if((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))){
    return s.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  return s;
}

const argv = process.argv.slice(2);
const file = argv[0] ? path.resolve(argv[0]) : path.resolve(process.cwd(), 'example.alpa');
const functionName = argv[1] || null; // optional function name to run

if(!fs.existsSync(file)){
  console.error('File not found:', file);
  process.exit(2);
}

const src = fs.readFileSync(file, 'utf8');

// Very small parser: find print("...") calls. If functionName provided, extract the function body first.
let searchSrc = src;
if (functionName) {
  // crude function body extraction: find 'func <name>(...) { ... }'
  const funcRe = new RegExp("func\\s+" + functionName + "\\s*\\([^\\)]*\\)\\s*\\{([\\s\\S]*?)\\}", 'm');
  const fm = funcRe.exec(src);
  if (fm && fm[1]) {
    searchSrc = fm[1];
  } else {
    console.error(`Function '${functionName}' not found in file.`);
    process.exit(3);
  }
}

const printRegex = /print\s*\(\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*\)/g;
let m;
const outputs = [];
while((m = printRegex.exec(searchSrc)) !== null){
  outputs.push(unquote(m[1]));
}

if(outputs.length === 0){
  console.log('[Alpa Runner] No print statements found to execute.');
  process.exit(0);
}

for(const o of outputs){
  console.log(o);
}
