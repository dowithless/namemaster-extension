import * as vscode from "vscode";
import { NamingSuggestionsProvider } from "../completion-item-provider";

export function registerNaming(context: vscode.ExtensionContext) {
  const namingSuggestionsProvider = new NamingSuggestionsProvider(context);
  const provider = vscode.languages.registerCompletionItemProvider(
    { pattern: "**/*" },
    namingSuggestionsProvider
  );
  context.subscriptions.push(provider);

  const disposable = vscode.commands.registerCommand(
    "namemaster.naming",
    () => {
      namingSuggestionsProvider.enabled = true;

      vscode.commands.executeCommand("editor.action.triggerSuggest");
    }
  );

  context.subscriptions.push(disposable);
}
