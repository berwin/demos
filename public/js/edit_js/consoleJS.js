'use strict';

define(function (require, exports, module) {
    // Creating the console.
    var header = 'Welcome to Demos!\n' +
        'Here, you can enjoy, fun programming\n'+
        'Ctrl+Enter is Run Script  Ctrl+K is Clear Screen\n'+
        '------------------------------------------------------\n';
    var jqconsole = $('#repl').jqconsole(header, '> ');

    window.console.log = function(a) {
        var str = JSON.stringify( a );
        jqconsole.Write( str + '\n');
    }

    // Abort prompt on Ctrl+Z.
    jqconsole.RegisterShortcut('Z', function() {
        jqconsole.AbortPrompt();
        handler();
    });
    // Move to line start Ctrl+A.
    jqconsole.RegisterShortcut('A', function() {
        jqconsole.MoveToStart();
        handler();
    });
    // Move to line end Ctrl+E.
    jqconsole.RegisterShortcut('E', function() {
        jqconsole.MoveToEnd();
        handler();
    });
    // Clear
    jqconsole.RegisterShortcut('K', function() {
        jqconsole.Clear();
    });
    jqconsole.RegisterMatching('{', '}', 'brace');
    jqconsole.RegisterMatching('(', ')', 'paran');
    jqconsole.RegisterMatching('[', ']', 'bracket');
    // Handle a command.
    function handler (command) {
        if (command) {
            try {
                var result = eval(command);
                jqconsole.Write(JSON.stringify( result ) + '\n', 'result');
            } catch (e) {
                jqconsole.Write('Error: ' + e.message + '\n', 'error');
            }
        }
        jqconsole.Prompt(true, handler, function(command) {
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
});