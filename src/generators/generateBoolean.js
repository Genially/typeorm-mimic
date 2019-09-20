'use strict';

/**
 * Generates a random boolean
 */
module.exports = ({ required }) => {
  if (!required && Math.random() < 0.3) {
    return null;
  }

  return Math.random() < 0.5 ? false : true;
};
