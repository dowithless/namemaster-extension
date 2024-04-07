import * as vscode from "vscode";
import { generateNamingSuggestions } from "../api";

export class NamingSuggestionsProvider
  implements vscode.CompletionItemProvider
{
  enabled: boolean;
  private readonly extensionContext: vscode.ExtensionContext;

  constructor(extensionContext: vscode.ExtensionContext) {
    this.extensionContext = extensionContext;
    this.enabled = false;
  }
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Thenable<vscode.CompletionItem[]> | undefined {
    // 获取当前活动的编辑器
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showInformationMessage("No active editor");
      return undefined;
    }

    // 只允许通过命令触发
    if (!this.enabled) {
      return undefined;
    }

    // 获取文件的语言标识符
    const language = activeEditor.document.languageId;

    const text = document
      .lineAt(position)
      .text.substring(0, position.character);

    const key = this.extensionContext.globalState.get("key") as string;

    const completionItems: Thenable<vscode.CompletionItem[]> =
      generateNamingSuggestions({ key, text, language })
        .then((data) => {
          const { match, kind, results, error } = data;
          if (error) {
            vscode.window.showErrorMessage(error);
            return [];
          }

          const completionItemKind =
            vscode.CompletionItemKind[
              kind as keyof typeof vscode.CompletionItemKind
            ] ?? vscode.CompletionItemKind.Text;

          const items = results.map(({ name, desc }) => {
            let item = new vscode.CompletionItem(name, completionItemKind);

            // 添加描述和详细说明
            item.detail = name;
            item.documentation = new vscode.MarkdownString(desc);
            item.insertText = `${text.replace(match, name)}`;

            const lineStart = new vscode.Position(position.line, 0);
            const lineEnd = new vscode.Position(
              position.line,
              Number.MAX_VALUE
            );

            // 设置补全项替换文本的范围：整行
            item.range = new vscode.Range(lineStart, lineEnd);

            item.filterText = text;

            return item;
          });

          return items;
        })
        .catch((error: any) => {
          vscode.window.showErrorMessage(error.message);
          return [];
        })
        .finally(() => {
          this.enabled = false;
        });

    return completionItems;
  }
}
