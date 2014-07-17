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
    console.group('example');
    console.log(example);
    console.groupEnd();
    console.groupEnd();
}
