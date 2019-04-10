const Future = require('fluture');
const fs = require('fs')
const R = require('ramda')
const { ExportSVG, SVG } = require('simple-svg-tools');

const LINE_HEIGHT = 20;
const WIDTH = 1000;
const HTML_SAFE_CHARS = {
    '<': 'lt',
    '>': 'gt',
    '"': 'quot',
    '\'': 'apos',
    '&': 'amp',
    '\r': '#10',
    '\n': '#13'
};

const wrap = (w, h, lines) => [
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>`,
    ...lines,
    '</svg>'
].join('\n');

const safeChar = (chr) => `&${HTML_SAFE_CHARS[chr]};`;
const safetext = (text) => text.toString().replace(/[<>''\r\n&]/g, safeChar);
const pad = (n) => {
    const str = '' + n;
    const pad = '   ';
    return pad.substring(0, pad.length - str.length) + str;
};

const createLineNo = (i) => `
    <text 
    x='20' 
    y='${(i + 1) * LINE_HEIGHT}' 
    style='font-family:courier; white-space: pre'
    >
    ${safetext(String(pad(i + 1)))}
    </text>`;

const createLineContent = (str, i) => `
    <text 
    x='65' 
    y='${(i + 1) * LINE_HEIGHT}' 
    style='font-family:courier; white-space: pre'
    >
    ${safetext(str)}
    </text>`;

const createText = (str, i) => `
    ${createLineNo(i)}
    ${createLineContent(str, i)}`;

const readDirectory = (path) =>
    Future.Future((reject, resolve) => fs.readdir(
        path,
        (err, contents) => err
            ? reject(err)
            : resolve(contents)),
    );

const readFile = (filepath) =>
    Future.Future((reject, resolve) => fs.readFile(
        filepath,
        'utf8',
        (err, data) => err
            ? reject(err)
            : resolve(data)),
    );

const saveSVG = (filename) => (svg) =>
    Future.tryP(() => ExportSVG(svg, `${filename}.svg`));

const convertFile = (filename) =>
    readFile(filename)
        .map(R.tap(() => console.log(`opening ${filename}`)))
        .map(createSvg)
        .chain(saveSVG(filename))
        .bimap(
            R.tap(() => console.log(`failed to save ${filename}.svg`)),
            R.tap(() => console.log(`saved ${filename}.svg`)),
        );

const createFilepath = (path) => (name) => path + '/' + name;

const convertFiles = (filepaths) =>
    Future.parallel(10, R.map(convertFile, filepaths));

const createSvg = (data) => {

    const lines = data
        .split(/\r?\n/)
        .map(createText)

    const content = wrap(WIDTH, (lines.length + 1) * LINE_HEIGHT, lines);

    return new SVG(content);

};

const convertDirectory = (path) =>
    readDirectory(path)
        .map(R.map(createFilepath(path)))
        .chain(convertFiles)
        .fork(
            R.partial(console.log, ['some files failed to convert\n']),
            R.identity,
        );

(function () {

    if (process.argv.length < 3) {

        console.log('Usage: node ' + process.argv[1] + ' FILENAME');
        process.exit(1);

    } else {

        convertDirectory(process.argv[2])

    }

})();
