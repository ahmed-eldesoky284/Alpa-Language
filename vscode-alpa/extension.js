const vscode = require('vscode');

function activate(context) {
  console.log('Alpa language extension activated');
  // Prompt user to enable Alpa File Icons theme if not already active
  try {
    const currentIconTheme = vscode.workspace.getConfiguration().get('workbench.iconTheme');
    if (currentIconTheme !== 'alpa-file-icons') {
      vscode.window.showInformationMessage('Enable Alpa file icons for .alpa files?', 'Yes', 'No').then(choice => {
        if (choice === 'Yes') {
          vscode.workspace.getConfiguration().update('workbench.iconTheme', 'alpa-file-icons', true).then(() => {
            vscode.window.showInformationMessage('Alpa file icons enabled.');
          }, err => {
            vscode.window.showErrorMessage('Failed to enable Alpa file icons: ' + err.message);
          });
        }
      });
    }
  } catch (e) {
    // ignore in restricted environments
  }
  // Register semantic tokens provider (existing)
  let disposableTokens = vscode.languages.registerDocumentSemanticTokensProvider({ language: 'alpa' }, new DummyProvider(), legend);
  context.subscriptions.push(disposableTokens);

  const { execFile } = require('child_process');

  // CodeLens provider: show 'Run' above every function definition
  class AlpaCodeLensProvider {
    provideCodeLenses(document) {
      const lenses = [];
      const text = document.getText();
      const regex = /\bfunc\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
      let m;
      while ((m = regex.exec(text)) !== null) {
        const funcName = m[1];
        const pos = document.positionAt(m.index);
        const range = new vscode.Range(pos.line, 0, pos.line, 0);
        const lens = new vscode.CodeLens(range, {
          title: 'Run',
          command: 'alpa.runFile',
          arguments: [funcName]
        });
        lenses.push(lens);
      }
      return lenses;
    }

    resolveCodeLens(codeLens) {
      return codeLens;
    }
  }

  const codeLensProvider = new AlpaCodeLensProvider();
  context.subscriptions.push(vscode.languages.registerCodeLensProvider({ language: 'alpa' }, codeLensProvider));

  // Output channel for runner
  const output = vscode.window.createOutputChannel('Alpa Runner');
  context.subscriptions.push(output);

  // Command: Say Hello
  let sayHello = vscode.commands.registerCommand('alpa.sayHello', function () {
    vscode.window.showInformationMessage('Hello from Alpa extension 👋');
  });
  context.subscriptions.push(sayHello);

  // Command: Insert example snippet at cursor
  let insertSnippet = vscode.commands.registerCommand('alpa.insertSnippet', function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }
    const snippet = new vscode.SnippetString('// Alpa example\nfunc main() {\n  print("Hello, Alpa")\n}\n');
    editor.insertSnippet(snippet);
  });
  context.subscriptions.push(insertSnippet);

  // Command: Run current Alpa file
  let runFile = vscode.commands.registerCommand('alpa.runFile', function (functionName) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }
    const doc = editor.document;
    if (doc.languageId !== 'alpa' && !doc.fileName.endsWith('.alpa')) {
      vscode.window.showErrorMessage('Current file is not an Alpa file');
      return;
    }
    // Save the file before running
    doc.save().then(() => {
      const runner = vscode.Uri.joinPath(vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri : vscode.Uri.file('.'), 'tools', 'run-alpa.cjs').fsPath;
      const fileToRun = doc.fileName;
      output.clear();
      output.show(true);
      output.appendLine('='.repeat(60));
      output.appendLine(`[Alpa] Running ${fileToRun}${functionName ? ' :: ' + functionName : ''} with ${runner}`);
      output.appendLine('='.repeat(60));
      const procArgs = functionName ? [runner, fileToRun, functionName] : [runner, fileToRun];
      const child = execFile('node', procArgs, { cwd: vscode.workspace.rootPath }, (err, stdout, stderr) => {
        if (err) {
          output.appendLine(`[Error] ${err.message}`);
        }
        if (stdout) output.appendLine(stdout);
        if (stderr) output.appendLine(stderr);
        output.appendLine('='.repeat(60));
      });
    });
  });
  context.subscriptions.push(runFile);
}

function deactivate() {}

const legend = new vscode.SemanticTokensLegend(['keyword','string','number','variable'], []);

class DummyProvider {
  provideDocumentSemanticTokens(document) {
    const builder = new vscode.SemanticTokensBuilder();
    const text = document.getText();
    const lines = text.split(/\r?\n/);
    const keywordRe = /\b(if|else|for|while|return|func|print)\b/g;
    const numberRe = /\b(\d+)\b/g;
    const stringRe = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];

      let m;
      while ((m = keywordRe.exec(line)) !== null) {
        const start = m.index;
        const len = m[0].length;
        builder.push(lineIndex, start, len, 0, 0); // keyword -> tokenType 0
      }

      while ((m = numberRe.exec(line)) !== null) {
        const start = m.index;
        const len = m[0].length;
        builder.push(lineIndex, start, len, 2, 0); // number -> tokenType 2
      }

      while ((m = stringRe.exec(line)) !== null) {
        const start = m.index;
        const len = m[0].length;
        builder.push(lineIndex, start, len, 1, 0); // string -> tokenType 1
      }
    }

    return builder.build();
  }
}

module.exports = { activate, deactivate };
