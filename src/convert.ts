import * as R from 'ramda';
import * as Future from 'fluture';

import { Configuration } from './constants';
import { readDirectory, readFile } from './fs';
import * as SVG from './svg';

export const init = (config: Configuration) => {

    const { maxParallelism, dirpath } = config;
    const { createSvg, saveSvg } = SVG.init(config);

    const convertFile = (filename: string) =>
        readFile(filename)
            .map(R.tap(() => console.log(`opening ${filename}`)))
            .map(createSvg as any)
            .chain(saveSvg(filename))
            .bimap(
                R.tap(() => console.log(`failed to save ${filename}.svg`)),
                R.tap(() => console.log(`saved ${filename}.svg`)),
            );

    const createFilepath = (path: string) => (name: string) => path + '/' + name;

    const convertFiles = (filepaths: string[]) =>
        Future.parallel(maxParallelism, R.map(convertFile, filepaths));

    return {
        convertDirectory: readDirectory(dirpath)
            .map(R.map(createFilepath(dirpath)) as any)
            .chain(convertFiles as any),
    };

};
