import { ExportSVG, SVG } from 'simple-svg-tools';
import * as Future from 'fluture';

import { Configuration } from '../../constants';

const HTML_SAFE_CHARS: { [k: string]: string } = {
    '<': 'lt',
    '>': 'gt',
    '"': 'quot',
    '\'': 'apos',
    '&': 'amp',
    '\r': '#10',
    '\n': '#13'
};

export const init = ({ lineHeight, width }: Configuration) => {

    const wrap = (w: number, h: number, lines: string[]) => [
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>`,
        ...lines,
        '</svg>'
    ].join('\n');

    const safeChar = (c: string) => `&${HTML_SAFE_CHARS[c]};`;

    const safetext = (text: string) =>
        text.toString()
            .replace(/[<>''\r\n&]/g, safeChar);

    const pad = (n: number) => {
        const str = '' + n;
        const pad = '   ';
        return pad.substring(0, pad.length - str.length) + str;
    };

    const createLineNo = (i: number) => `
        <text 
        x='20' 
        y='${(i + 1) * lineHeight}' 
        style='font-family:courier; white-space: pre'
        >
        ${safetext(String(pad(i + 1)))}
        </text>`;

    const createLineContent = (str: string, i: number) => `
        <text 
        x='65' 
        y='${(i + 1) * lineHeight}' 
        style='font-family:courier; white-space: pre'
        >
        ${safetext(str)}
        </text>`;

    const createText = (str: string, i: number) => `
        ${createLineNo(i)}
        ${createLineContent(str, i)}`;

    type SVG = any;

    const createSvg = (data: string) => {

        const lines = data
            .split(/\r?\n/)
            .map(createText)

        const content = wrap(width, (lines.length + 1) * lineHeight, lines);

        return new SVG(content);

    };

    const saveSvg = (filename: string) => (svg: SVG) =>
        Future.tryP(() => ExportSVG(svg, `${filename}.svg`));

    return { createSvg, saveSvg };

};
