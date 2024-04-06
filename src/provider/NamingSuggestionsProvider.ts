import * as vscode from "vscode";
import axios from "axios";

const API_URL = process.env.API_URL || "https://www.namemaster.org";

async function fetchNamingSuggestions(
  userKey: string,
  text: string
): Promise<{
  error?: string;
  match: string;
  kind: string;
  results: { name: string; desc: string }[];
}> {
  const { data } = await axios.get(`${API_URL}/api/naming`, {
    params: {
      key: userKey,
      language: "js",
      text,
    },
  });

  console.log("api res", data);

  return data;
}

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
    // 只允许通过命令触发
    if (!this.enabled) {
      return undefined;
    }

    const linePrefix = document
      .lineAt(position)
      .text.substring(0, position.character);

    const userKey = this.extensionContext.globalState.get("key") as string;

    return fetchNamingSuggestions(userKey, linePrefix)
      .then((data) => {
        const { match, kind, results, error } = data;
        if (error) {
          vscode.window.showErrorMessage(error);
          return [];
        }

        const completionItems = results.map(({ name, desc }) => {
          let item = new vscode.CompletionItem(
            name,
            vscode.CompletionItemKind.Text
          );

          // 添加描述和详细说明
          item.detail = name;
          item.documentation = new vscode.MarkdownString(desc);
          const insertText = `${linePrefix.replace(match, name)}`;
          item.insertText = insertText;

          const lineStart = new vscode.Position(position.line, 0);
          const lineEnd = new vscode.Position(position.line, Number.MAX_VALUE);

          // 设置补全项替换文本的范围：整行
          item.range = new vscode.Range(lineStart, lineEnd);

          item.filterText = linePrefix;

          return item;
        });

        return completionItems;
      })
      .catch((error: any) => {
        return [];
        vscode.window.showErrorMessage(error.message);
      })
      .finally(() => {
        this.enabled = false;
      });
  }
}
