'use strict';

let jsoneq = require('cl-jsoneq');

/**
 * provide a standard compare set
 */

module.exports = {
    '=': (v1, v2) => v1 === v2,
    'jsoneq': jsoneq,
    '!=': (v1, v2) => v1 !== v2,
    '>': (v1, v2) => v1 > v2,
    '>=': (v1, v2) => v1 >= v2,
    '<': (v1, v2) => v1 < v2,
    '<=': (v1, v2) => v1 <= v2
};
