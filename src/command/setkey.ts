import * as vscode from "vscode";

export function registerSetkey(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "namemaster.setkey",
    async () => {
      // 弹出输入框要求用户输入一个key
      const key = await vscode.window.showInputBox({
        placeHolder: "请输入key并按Enter保存",
      });

      if (key !== undefined && key !== "") {
        // 将用户输入的key保存起来，这里使用GlobalState作为示例
        context.globalState.update("key", key);
        vscode.window.showInformationMessage(`设置完成 🎉!`);
      } else {
        vscode.window.showErrorMessage("未输入有效的key！");
      }
    }
  );

  context.subscriptions.push(disposable);
}
