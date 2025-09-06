const vscode = require('vscode');

function activate(context) {
  console.log('Alpa language extension activated');

  let disposable = vscode.languages.registerDocumentSemanticTokensProvider({ language: 'alpa' }, new DummyProvider(), legend);

  context.subscriptions.push(disposable);
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
