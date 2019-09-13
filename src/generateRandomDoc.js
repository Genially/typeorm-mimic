'use strict';

const flat = require('flat');
const unflatten = flat.unflatten;
const createCustomGenerator = require('./createCustomGenerator');
const createBasicGenerator = require('./generators');

/**
 * Creates the corresponding data generators from the given custom fields options
 *
 * @param {object} customOpts the custom fields options
 * @returns {object}
 * an object with the custom generator of each field, with the following format:
 * {
 *   <field name>: <custom generator>
 * }
 */
const createCustomGenerators = (customOpts = {}) => {
  const customGenerators = {};

  for (let field in customOpts) {
    let customField = customOpts[field];
    customGenerators[field] = createCustomGenerator(customField);
  }

  return customGenerators;
};

/**
 * Checks if the given field must be ignored
 *
 * @param {string} field the field name
 * @param {object} ignoreOpts the ignore options
 * @returns {boolean}
 * true if the field must be ignored, false otherwise
 */
const fieldMustBeIgnored = (field, ignoreOpts = []) =>
  ignoreOpts.findIndex(element => {
    if (typeof element === 'string') return field === element;
    else return element.test(field);
  }) !== -1;

/**
 * Returns a random value from the given enum
 *
 * @param {string[]} enumDefinition array that contains all enum values
 * @returns {string}
 * an enum value
 */
const selectRandomEnum = enumDefinition => {
  const randomIndex = Math.round(Math.random() * (enumDefinition.length - 1));
  return enumDefinition[randomIndex];
};

/**
 * Generates an array of values that meet the given column definition
 *
 * @param {function} generate the function to generate values
 * @returns {any[]}
 * an array that contains values
 */
const generateRandomArray = (generate, columnDefinition, opts) => {
  const array = [];
  const arrayLength = Math.floor(Math.random() * 15 + 1);

  for (let i = 0; i < arrayLength; i++) {
    array.push(generate());
  }

  return array;
};

/**
 * Generates a value or array of values that meet the given column definition
 *
 * @param {function} generate the function to generate values
 * @param {object} columnDefinition the column definition
 * @param {object} opts the configuration options
 * @returns {any}
 * a value or array of values
 */
const generateValue = (generate, columnDefinition, opts) => {
  let value = undefined;

  if (columnDefinition.isArray) {
    value = generateRandomArray(generate);
  } else {
    value = generate();
  }

  if (columnDefinition.type === Date && opts.datesAsString) {
    value = value.toString();
  }

  return value;
};

/**
 * Generates a document with random values (or custom values), as a spread
 *
 * @param {object} effectiveSchema the effective schema
 * @param {object} opts the configuration options
 * @returns {object}
 * a random document, as a spread
 */
const generateRandomDoc = (
  effectiveSchema,
  opts = { datesAsString: false }
) => {
  const customGenerators = createCustomGenerators(opts.custom);

  const generatedDoc = {};

  for (let columnName in effectiveSchema) {
    if (fieldMustBeIgnored(columnName, opts.ignore)) {
      continue;
    }

    let columnDefinition = effectiveSchema[columnName];

    if (columnDefinition.default) {
      generatedDoc[columnName] = columnDefinition.default;
      continue;
    }

    if (columnDefinition.isEnum) {
      generatedDoc[columnName] = selectRandomEnum(columnDefinition.enum);
      continue;
    }

    let generateCustomValue = customGenerators[columnName];
    if (generateCustomValue) {
      generatedDoc[columnName] = generateValue(
        generateCustomValue,
        columnDefinition,
        opts
      );

      continue;
    }

    let generateRandomValue = createBasicGenerator(columnDefinition);
    if (generateRandomValue) {
      generatedDoc[columnName] = generateValue(
        generateRandomValue,
        columnDefinition,
        opts
      );
    }
  }

  return unflatten(generatedDoc); /* Unflatten dot notation */
};

module.exports = generateRandomDoc;
