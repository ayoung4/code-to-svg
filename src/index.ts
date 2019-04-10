import * as R from 'ramda';

import { createApp } from './app';
import { CONFIG } from './constants';

const usage = { run: () => console.log('could not start') as any };

createApp(process, CONFIG)
    .orJust(usage)
    .run();
