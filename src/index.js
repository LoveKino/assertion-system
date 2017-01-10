'use strict';

/**
 * assertion system
 *
 * traditional assertion coding style:
 * ```js
 * var a = fun(); // run function
 * var feature = a.b * 10; // construct feature
 * assert.equal(feature, 50); // do the assertion
 * ```
 *
 * There are two major steps:
 *
 * 1. get the feature
 * 2. compare feature and prediction
 *
 * feature   ?   prediction
 *
 * ?: compare (relationship)
 *
 *
 * feature:
 * 1. feature definition
 * 2. feature fetcher
 *    Get feature in current state. Explain feature definition in current state to get feature
 *
 * assertion:
 * 1. feature definition
 * 2. feature fetcher
 * 3. prediction
 * 4. compare
 */

let {
    set, get
} = require('jsenhance');

let {
    forEach, compact
} = require('bolzano');

let {
    isFunction, funType, isString, or, isFalsy, truth, isObject
} = require('basetype');

let assertioner = (featureDef, featureFet, prediction, compare) => (state) => {
    let feature = featureFet(featureDef, state);
    let ret = compare(feature, prediction);
    if (ret === false) {
        throw new Error(`[assertion fail] compare type is ${compare.compareType}, feature type is ${compare.featureType}, feature ${feature}, predication is ${prediction}.`);
    }

    return ret;
};

/**
 *
 * two aspects
 *
 * 1. feature provider
 *     no1. feature type
 *     no2. feature fetcher
 *     no3. feature definition validator (optional)
 *
 * 2. compare provider
 *   no1. compare type
 *   no2. compare definition
 *
 * 2. assertion definer
 *    (1) feature type
 *    (2) feature definition
 *    (3) predicte type
 *    (4) prediction
 */

module.exports = () => {
    let featureProviders = {};
    let compareProviders = {};

    let registerFeature = funType((type, featureFet, featureVali) => {
        if (get(featureProviders, type)) {
            throw new Error(`feature ${type} was defined already.`);
        }

        featureFet.featureType = type;
        set(featureProviders, type, {
            fetcher: featureFet,
            validator: featureVali
        });
    }, [isString, isFunction, or(isFunction, isFalsy)]);

    let registerCompare = funType((type, definition) => {
        if (get(compareProviders, type)) {
            throw new Error(`compare ${type} was defined already.`);
        }

        definition.compareType = type;
        set(compareProviders, type, definition);
    }, [isString, isFunction]);

    let registerCompareSet = funType((set, prefix = '') => {
        forEach(set, (item, name) => {
            let itemType = compact([prefix, name]).join('.');
            if (isObject(item)) {
                registerCompareSet(item, itemType);
            } else {
                registerCompare(itemType, item);
            }
        });
    }, [isObject, isString]);

    let defineAssertionRule = funType((featureType, featureDef, compareType, prediction) => {
        let feature = get(featureProviders, featureType);
        if (!feature) {
            throw new Error(`missing feature with type ${featureType}`);
        }
        if (feature.validator) {
            feature.validator(featureDef);
        }

        let compare = get(compareProviders, compareType);
        if (!compare) {
            throw new Error(`missing compare with type ${compareType}`);
        }

        return assertioner(featureDef, feature.fetcher, prediction, compare);
    }, [isString, truth, isString, truth]);

    return {
        registerFeature,
        registerCompare,
        registerCompareSet,
        defineAssertionRule
    };
};
