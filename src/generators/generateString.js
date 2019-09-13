'use strict';

const faker = require('faker');

/**
 * Generates a random string
 */
module.exports = ({ uppercase, lowercase, trim }) => {
  return faker.internet.userName();
};
