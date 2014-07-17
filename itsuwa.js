function itsuwa(obj) {
    // 일단 함수인 경우만 가정
    if (typeof obj !== 'function') {
        console.warn('this is not a function');
        return;
    }
    function docTrim(comment) {
        return comment.
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
}
