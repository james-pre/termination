import { main } from './system/sbin/init.js';
await main('/sbin/init', 'user=0', 'debug');
