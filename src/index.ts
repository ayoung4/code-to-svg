import * as R from 'ramda';

import * as Convert from './convert';
import { CONFIG } from './constants';

(function () {

    const { convertDirectory } = Convert.init({
        ...CONFIG,
        dirpath: process.argv[2]
    });

    if (process.argv.length < 3) {

        console.log('Usage: node ' + process.argv[1] + ' FILENAME');
        process.exit(1);

    } else {

        convertDirectory.fork(
            R.partial(console.log, ['some files failed to convert\n']),
            R.identity,
        )

    }

})();
