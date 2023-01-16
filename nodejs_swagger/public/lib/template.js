module.exports = {
    HTML : function(title, list, body, add){
    return `
    <!doctype html>
    <html>
    <head>
        <title>WEB1 - Welcome</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">Web</a></h1>
        ${list}
        ${add}
        ${body}
    </body>
    </html>
    `;
}, List : function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
        list = list + `<li><a href='/?id=${filelist[i]}'>${filelist[i]}</a></li>`;
        i++;
    }
    list = list + '</ul>';
    return list;
}
};