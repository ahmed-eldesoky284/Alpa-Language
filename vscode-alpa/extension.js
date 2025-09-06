const vscode = require('vscode');

function activate(context) {
  console.log('Alpa language extension activated');
  // Register semantic tokens provider (existing)
  let disposableTokens = vscode.languages.registerDocumentSemanticTokensProvider({ language: 'alpa' }, new DummyProvider(), legend);
  context.subscriptions.push(disposableTokens);

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
