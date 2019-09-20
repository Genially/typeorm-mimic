'use strict';

const faker = require('faker');

/**
 * Generates a random string
 */
module.exports = ({ required }) => {
  if (!required && Math.random() < 0.3) {
    return null;
  }

  return faker.internet.userName();
};
