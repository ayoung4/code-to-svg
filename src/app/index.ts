import * as R from 'ramda';
import { Maybe } from 'monet';

import * as Convert from './converter';
import { Configuration } from '../constants';

export const createApp = (proc: NodeJS.Process, config: Configuration) => {

    const checkArgs = (argv: string[]) =>
        argv.length < 3
            ? Maybe.none()
            : Maybe.of(argv);

    const createConverter = (argv: any) => Convert.init({
        ...config,
        dirpath: argv[2],
    });

    return Maybe.fromNull(proc)
        .map(R.prop('argv'))
        .chain(checkArgs)
        .map(createConverter)
        .map(({ convertDirectory }) => ({
            run: () => convertDirectory.fork(
                R.partial(console.log, ['some files failed to convert\n']),
                R.identity,
            ),
        }));

};
