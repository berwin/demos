'use strict';

// 创建控制台
var header = 'Welcome to Demos!\n' +
  'Here, you can enjoy, fun programming\n'+
  'Ctrl+Enter is Run Script  Ctrl+K is Clear Screen\n'+
  '------------------------------------------------------\n';
var jqconsole = $('#repl').jqconsole(header, '> ');

window.console.log = function (a) {
  var str = JSON.stringify(a);
  jqconsole.Write(str + '\n');
}

// 终止 Ctrl+Z.
jqconsole.RegisterShortcut('Z', function () {
  jqconsole.AbortPrompt();
  handler();
});
// 移动光标到开始位置 Ctrl+A.
jqconsole.RegisterShortcut('A', function () {
  jqconsole.MoveToStart();
  handler();
});
// 移动光标到结束位置 Ctrl+E.
jqconsole.RegisterShortcut('E', function () {
  jqconsole.MoveToEnd();
  handler();
});
// 清屏 Ctrl + K
jqconsole.RegisterShortcut('K', function () {
  jqconsole.Clear();
});
jqconsole.RegisterMatching('{', '}', 'brace');
jqconsole.RegisterMatching('(', ')', 'paran');
jqconsole.RegisterMatching('[', ']', 'bracket');

// Handle a command.
function handler(command) {
  if (command) {
    try {
      var result = eval(command);
      jqconsole.Write(JSON.stringify(result) + '\n', 'result');
    } catch (e) {
      jqconsole.Write('Error: ' + e.message + '\n', 'error');
    }
  }
  jqconsole.Prompt(true, handler, function (command) {
    // Continue line if can't compile the command.
    try {
      Function(command);
    } catch (e) {
      if (/[\[\{\(]$/.test(command)) {
        return 1;
      } else {
        return 0;
      }
    }
    return false;
  });
};

// Initiate the first prompt.
handler();

exports.handler = handler;
exports.jqconsole = jqconsole;