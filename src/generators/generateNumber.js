'use strict';

const faker = require('faker');

/**
 * Generates a random number
 */
module.exports = ({ required }) => {
  if (!required && Math.random() < 0.3) {
    return null;
  }

  return faker.random.number(100);
};
