const vscode = require('vscode');

function activate(context) {
  console.log('Alpa language extension activated');
  // Register semantic tokens provider (existing)
  let disposableTokens = vscode.languages.registerDocumentSemanticTokensProvider({ language: 'alpa' }, new DummyProvider(), legend);
  context.subscriptions.push(disposableTokens);

  const { execFile } = require('child_process');

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
  let runFile = vscode.commands.registerCommand('alpa.runFile', function () {
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
      output.appendLine(`[Alpa] Running ${fileToRun} with ${runner}`);
      const child = execFile('node', [runner, fileToRun], { cwd: vscode.workspace.rootPath }, (err, stdout, stderr) => {
        if (err) {
          output.appendLine(`[Error] ${err.message}`);
        }
        if (stdout) output.appendLine(stdout);
        if (stderr) output.appendLine(stderr);
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
    // no-op: placeholder tokens
    return builder.build();
  }
}

module.exports = { activate, deactivate };
