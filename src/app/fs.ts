import * as Future from 'fluture';
import * as fs from 'fs';

export const readDirectory = (path: string) =>
    Future.Future((reject, resolve) => fs.readdir(
        path,
        (err: Error, contents: string[]) => err
            ? reject(err)
            : resolve(contents)),
    );

export const readFile = (filepath: string) =>
    Future.Future((reject, resolve) => fs.readFile(
        filepath,
        'utf8',
        (err: Error, content: string) => err
            ? reject(err)
            : resolve(content)),
    );
