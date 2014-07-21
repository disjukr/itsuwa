;(function () {
    window.itsuwa = itsuwa;
    function itsuwa(obj) {
        switch (typeof obj) {
        case 'object':
            if (obj instanceof Number ? !printNumber(obj) :
                obj instanceof String ? !printString(obj) :
                obj instanceof Boolean ? !printBoolean(obj) : false
            ) return;
            break;
        case 'number':
            printNumber(obj);
            break;
        case 'string':
            printString(obj);
            break;
        case 'boolean':
            printBoolean(obj);
            break;
        case 'function':
            if (Object.keys(obj.prototype).length)
                printClass(obj);
            else
                printFunction(obj);
            break;
        default:
            break;
        }
    }
    itsuwa.amakusaStyle = amakusaStyle;
    function amakusaStyle(code /** code string to highlight */)
    /** return highlighted input code array for render to console */
    {
        /**
         * console.log.apply(
         *     console,
         *     itsuwa.amakusaStyle(itsuwa.amakusaStyle.toString())
         * );
         */
        var format = [];
        var formatString = [];
        var tokens = roughTokenize(code);
        while (tokens.length) {
            var token = tokens.shift();
            formatString.push('%c');
            format.push('color:' + (color[token.type] || color['other']));
            if (token.content == '%') {
                formatString.push('%s');
                format.push('%');
            } else {
                var shim = token.content.split('%');
                for (var i = 0, l = shim.length - 1; i < l; ++i)
                    format.push('%');
                formatString.push(shim.join('%s'));
            }
        }
        format.unshift(formatString.join(''));
        /** highlighted input code array for render to console */
        return format;
    }
    function parseFunction(func) {
        var data = {};
        data.name = func.name;
        data.description = '';
        data.parameters = [];
        data.returns = [];
        data.example = '';
        var tokens = roughTokenize(func + '').filter(function (token) {
            return token.type != 'space';
        });
        while (tokens[0].content != '(')
            tokens.shift();
        tokens.shift(); // consume (
        while (tokens[0].content != ')') {
            var parameter = {};
            parameter.name = tokens.shift().content;
            parameter.description = (tokens[0].type == 'doc') ?
                docTrim(tokens.shift().content) : '';
            data.parameters.push(parameter);
            while (tokens[0].content != ',' && tokens[0].content != ')')
                tokens.shift();
            if (tokens[0].content == ',')
                tokens.shift();
        }
        tokens.shift(); // consume )
        if (tokens[0].type == 'doc')
            data.description = docTrim(tokens.shift().content);
        while (tokens[0].content != '{')
            tokens.shift();
        tokens.shift(); // consume {
        if (tokens[0].type == 'doc') {
            if (!tokens[1] || tokens[1].content != 'return')
                data.example = docTrim(tokens.shift().content);
        }
        while (tokens.length) {
            var returnDescription;
            if (tokens[0].type == 'doc') {
                returnDescription = docTrim(tokens.shift().content);
                if (tokens.length && tokens[0].content == 'return')
                    data.returns.push(returnDescription);
            }
            tokens.shift();
        }
        return data;
    }
    function printFunction(value) {
        var data = parseFunction(value);
        console.group(
            '%cfunction%c %s',
            'font-weight: initial; font-size: 16px; color: ' + color['function'],
            'line-height: 30px; font-weight: initial; font-size: 20px; color: #000',
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
            console.log.apply(console, amakusaStyle(data.example));
            console.groupEnd();
        }
        console.groupEnd();
    }
    function printClass(value) {
        var data = parseFunction(value);
        console.group(
            '%cclass%c %s',
            'font-weight: initial; font-size: 16px; color: ' + color['class'],
            'line-height: 50px; font-weight: initial; font-size: 20px; color: #000',
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
        if (data.example.length) {
            console.group('example');
            console.log.apply(console, amakusaStyle(data.example));
            console.groupEnd();
        }
        var memberFields = Object.keys(value.prototype);
        if (memberFields.length) {
            console.group('members');
            memberFields.forEach(function (field) {
                console.group.apply(
                    console,
                    amakusaStyle('(new ' + data.name + ').' + field)
                );
                itsuwa(value.prototype[field]);
                console.groupEnd();
            });
            console.groupEnd();
        }
        console.groupEnd();
        var staticMemberFields = Object.keys(value);
        if (staticMemberFields.length) {
            console.group('static members');
            staticMemberFields.forEach(function (field) {
                console.group.apply(
                    console,
                    amakusaStyle(data.name + '.' + field)
                );
                itsuwa(value[field]);
                console.groupEnd();
            });
            console.groupEnd();
        }
        console.groupEnd();
    }
    function printNumber(value) {
        console.log(
            '%cnumber%c %s',
            'font-size: 16px; color: ' + color['number'],
            'font-size: 14px; color: #000',
            value + ''
        );
    }
    function printString(value) {
        console.log(
            '%cstring%c %s',
            'font-size: 16px; color: ' + color['string'],
            'font-size: 14px; color: #000',
            value + ''
        );
    }
    function printBoolean(value) {
        console.log(
            '%cboolean%c %s',
            'font-size: 16px; color: ' + color['boolean'],
            'font-size: 14px; color: #000',
            value + ''
        );
    }
    function roughTokenize(code) {
        var regex = new RegExp([
            '0[0-9]+', '0[Xx][0-9A-Fa-f]+', '\\d*\\.?\\d+(?:[Ee](?:[+-]?\\d+)?)?',
            '"(?:[^\\\\"]|\\\\.)*"|\'(?:[^\\\\\']|\\\\.)*\'',
            '\/\/.+',
            '\\/\\*(?:[^*]|[\\r\\n]|(?:\\*+(?:[^*/]|[\\r\\n])))*\\*+\\/',
            '\\/(?![\\s=])[^[\\/\\n\\\\]*(?:(?:\\\\[\\s\\S]|\\[[^\\]\\n\\\\]*(?:\\\\[\\s\\S][^\\]\\n\\\\]*)*])[^[\\/\\n\\\\]*)*\\/[gimy]{0,4}',
            '[^\\b\\s`~!@#%^&*/\\-+=,.;:\'"<>()[\\]{}\\\\|0-9][^\\b\\s`~!@#%^&*/\\-+=,.;:"\'<>()[\\]{}\\|]*',
            '\\s+', '.'
        ].join('|'), 'g');
        var list = [];
        var token = regex.exec(code);
        var tokenContent;
        var tokenType;
        while (token) {
            tokenContent = token[0];
            if (/^\s+$/.test(tokenContent)) {
                tokenType = 'space';
            } else if (/\/\*\*[^\/]/.test(tokenContent.substr(0, 4))) {
                tokenType = 'doc';
            } else if (tokenContent[0] == '/') {
                tokenType = (tokenContent[1] == '/' || tokenContent[1] == '*') ?
                    'comment' : 'regex';
            } else if (/^[0-9]/.test(tokenContent)) {
                tokenType = 'number';
            } else if (/^("|')/.test(tokenContent)) {
                tokenType = 'string';
            } else if (tokenContent == 'function') {
                tokenType = 'function';
            } else if (['true', 'false'].indexOf(tokenContent) >= 0) {
                tokenType = 'boolean';
            } else if ([
                'break', 'case', 'class', 'catch', 'const',
                'continue', 'debugger', 'default', 'delete', 'do',
                'else', 'export', 'extends', 'finally', 'for',
                'function', 'if', 'import', 'in', 'instanceof',
                'let', 'new', 'return', 'super', 'switch',
                'this', 'throw', 'try', 'typeof', 'var',
                'void', 'while', 'with', 'yield'
            ].indexOf(tokenContent) >= 0) {
                tokenType = 'keyword';
            } else if ([
                '+', '-', '*', '/', '%',
                '!', '~', '^', '|', '&',
                '<', '>', '=', '?', ':'
            ].indexOf(tokenContent) >= 0) {
                tokenType = 'operator';
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
            line = line.replace(/^\s*\*/, '');
            return line.replace(/^\s|\s+$/g, '');
        }).join('\n').trim();
    }
    var color = {
        'doc': '#d0c',
        'comment': '#999',
        'function': '#936',
        'class': '#096',
        'object': '#666',
        'string': '#e93',
        'number': '#36f',
        'boolean': '#93d',
        'keyword': '#f36',
        'operator': '#3b9',
        'other': '#000'
    };
})();
