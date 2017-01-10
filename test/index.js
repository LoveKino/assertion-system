'use strict';

let assertionSystem = require('..');
let {
    get
} = require('jsenhance');

describe('index', () => {
    it('base', () => {
        let {
            defineAssertionRule, registerFeature, registerCompareSet
        } = assertionSystem();

        registerCompareSet({
            equal: (v1, v2) => v1 === v2
        }, 'simple');

        registerFeature('get', (featureDef, state) => {
            return get(state, featureDef);
        });

        let rule = defineAssertionRule('get', 'number', 'simple.equal', 10);

        rule({
            'number': 10
        });
    });
});
