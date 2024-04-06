import * as vscode from "vscode";
import { registerSetkey } from "./command/setkey";
import { registerNaming } from "./command/naming";

export function activate(context: vscode.ExtensionContext) {
  console.log('Your extension "namemaster" is now active! 1');

  registerNaming(context);
  registerSetkey(context);
}

export function deactivate() {}
