;(function () {
    // window.itsuwa = itsuwa;
    function itsuwa(obj) {
        switch (typeof obj) {
        case 'function':
            printFunction(parseFunction(func));
            break;
        default:
            break;
        }
    }
    function parseFunction(func) {
        // TODO
    }
    function printFunction(data) {
        console.group(
            '%cfunction%c %s',
            'font-size: 18px; color: #936',
            'font-size: 16px; color: #000',
            data.name
        );
        console.info(data.description);
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
        console.group('returns');
        data.returns.forEach(function (description) {
            console.log(description);
        });
        console.groupEnd();
        console.group('example');
        console.log(data.example);
        console.groupEnd();
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
        while (token) {
            list.push(token);
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
function itsuwa(obj) {
    // 일단 함수인 경우만 가정
    if (typeof obj !== 'function') {
        console.warn('this is not a function');
        return;
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
    var funcString = (obj + '').substr(
        ('function ' + obj.name + '(').length
    );
    // parameters
    var parameters = [];
    while (funcString.charAt() !== ')') {
        var paramRegex = /([^\/,)]+)\s*(\/\*(?:(?!\*\/)(?:.|[\r\n]))*\*\/)?\s*,?/;
        var paramMatch = funcString.match(paramRegex);
        funcString = funcString.substr(paramMatch[0].length);
        parameters.push({
            name: paramMatch[1].trim(),
            description: docTrim(paramMatch[2])
        });
    }
    funcString = funcString.substr(1); // consume )
    // description
    var description;
    var descRegex = /\s*(\/\*(?:(?!\*\/)(?:.|[\r\n]))*\*\/)?\s*/;
    var descMatch = funcString.match(descRegex);
    funcString = funcString.substr(descMatch[0].length);
    description = docTrim(descMatch[1]);
    funcString = funcString.substr(1); // consume {
    // example
    var example;
    var exampleRegex = /\s*(\/\*(?:(?!\*\/)(?:.|[\r\n]))*\*\/)/;
    var exampleMatch = funcString.match(exampleRegex);
    funcString = funcString.substr(exampleMatch[0].length);
    example = docTrim(exampleMatch[1]);
    // returns
    var returns = [];
    var returnRegex = /(\/\*(?:(?!\*\/)(?:.|[\r\n]))*\*\/)\s*return/g;
    var returnMatch = returnRegex.exec(funcString);
    while (returnMatch) {
        returns.push(docTrim(returnMatch[1]));
        returnMatch = returnRegex.exec(funcString);
    }
    // render
    var color = {
        'function': '#936',
        'number': '#369',
        'string': '#396',
        'object': '#963'
    };
    console.group(
        '%cfunction%c %s',
        'font-size: 18px; color:' + color['function'],
        'font-size: 16px; color: #000',
        obj.name
    );
    console.info(description);
    console.group('parameters');
    parameters.forEach(function (parameter) {
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
    console.group('returns');
    returns.forEach(function (description) {
        console.log(description);
    });
    console.groupEnd();
    console.group('example');
    console.log(example);
    console.groupEnd();
    console.groupEnd();
}
