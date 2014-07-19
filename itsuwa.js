;(function () {
    window.itsuwa = itsuwa;
    function itsuwa(obj) {
        switch (typeof obj) {
        case 'function':
            printFunction(parseFunction(obj));
            break;
        default:
            break;
        }
    }
    function parseFunction(func) {
        var data = {};
        data.name = func.name;
        data.description = '';
        data.parameters = [];
        data.returns = [];
        data.example = '';
        var tokens = roughTokenize(func + '');
        while (tokens[0].content != '(')
            tokens.shift();
        tokens.shift(); // consume (
        while (tokens[0].content != ')') {
            var parameter = {};
            parameter.name = tokens.shift().content;
            parameter.description = (tokens[0].type == 'doc comment') ?
                docTrim(tokens.shift().content) : '';
            data.parameters.push(parameter);
            while (tokens[0].content != ',' && tokens[0].content != ')')
                tokens.shift();
            if (tokens[0].content == ',')
                tokens.shift();
        }
        tokens.shift(); // consume )
        if (tokens[0].type == 'doc comment')
            data.description = docTrim(tokens.shift().content);
        while (tokens[0].content != '{')
            tokens.shift();
        tokens.shift(); // consume {
        if (tokens[0].type == 'doc comment') {
            if (!tokens[1] || tokens[1].content != 'return')
                data.example = docTrim(tokens.shift().content);
        }
        while (tokens[0]) {
            var returnDescription;
            if (tokens[0].type == 'doc comment') {
                returnDescription = docTrim(tokens.shift().content);
                if (tokens[0] && tokens[0].content == 'return')
                    data.returns.push(returnDescription);
            }
            tokens.shift();
        }
        return data;
    }
    function printFunction(data) {
        console.group(
            '%cfunction%c %s',
            'font-size: 18px; color: #936',
            'font-size: 16px; color: #000',
            data.name
        );
        if (data.description.length)
            console.info(data.description);
        if (data.parameters.length) {
            console.group('parameters');
            data.parameters.forEach(function (parameter) {
                console.log(
                    '%c%s%c:%c %s',
                    'font-size: 14px; font-weight: bold;',
                    parameter.name,
                    'font-size: 8px;',
                    'font-weight: initial; color: #000;',
                    parameter.description
                );
            });
            console.groupEnd();
        }
        if (data.returns.length) {
            console.group('returns');
            data.returns.forEach(function (description) {
                console.log(description);
            });
            console.groupEnd();
        }
        if (data.example.length) {
            console.group('example');
            console.log(data.example);
            console.groupEnd();
        }
        console.groupEnd();
    }
    function roughTokenize(code) {
        var regex = new RegExp([
            '0[0-9]+', '0[Xx][0-9A-Fa-f]+', '\\d*\\.?\\d+(?:[Ee](?:[+-]?\\d+)?)?',
            '"(?:[^\\\\"]|\\\\.)*"|\'(?:[^\\\\\']|\\\\.)*\'',
            '\/\/.*$',
            '\\/\\*(?:[^*]|[\\r\\n]|(?:\\*+(?:[^*/]|[\\r\\n])))*\\*+\\/',
            '\\/(?![\\s=])[^[\\/\\n\\\\]*(?:(?:\\\\[\\s\\S]|\\[[^\\]\\n\\\\]*(?:\\\\[\\s\\S][^\\]\\n\\\\]*)*])[^[\\/\\n\\\\]*)*\\/[gimy]{0,4}',
            '[^\\b\\s`~!@#%^&*/\\-+=,.;:\'"<>()[\\]{}\\\\|0-9][^\\b\\s`~!@#%^&*/\\-+=,.;:"\'<>()[\\]{}\\|]*',
            '\\+|\\-|=|\\*|/|~|%|\\^|&|\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\||<|>|,|\\.|\\?|!|:|;'
        ].join('|'), 'g');
        var list = [];
        var token = regex.exec(code);
        var tokenContent;
        var tokenType;
        while (token) {
            tokenContent = token[0];
            if (/\/\*\*[^\/]/.test(tokenContent.substr(0, 4))) {
                tokenType = 'doc comment';
            } else if (tokenContent[0] == '/') {
                tokenType = (tokenContent[1] == '/' || tokenContent[1] == '*') ?
                    'comment' : 'regex';
            } else if (/^[0-9]/.test(tokenContent)) {
                tokenType = 'number';
            } else if (/^("|')/.test(tokenContent)) {
                tokenType = 'string';
            } else {
                tokenType = 'other';
            }
            list.push({
                content: tokenContent,
                type: tokenType,
                index: token.index
            });
            token = regex.exec(code);
        }
        return list;
    }
    function docTrim(comment) {
        if (!comment)
            return '';
        return (comment + '').
               replace(/^\/(\*\*|\*)/, '').
               replace(/\*\/$/, '').
               split(/\r?\n/).
               map(function (line) {
            return line.replace(/^\s*\*/, '').trim();
        }).join('\n').trim();
    }
})();
