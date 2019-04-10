import * as R from 'ramda';

import * as App from './app';
import { DEFAULTS } from './constants';

const usage = {
    run: R.partial(console.log, ['usage: index [dirname]']),
};

App.init(process, DEFAULTS)
    .orJust(usage as any)
    .run();
