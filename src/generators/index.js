/**
 * Creates a random data generator from the given field definition
 *
 * @param definition the field definition
 * @returns {function}
 * a random data generator, or undefined if there are no generators that meet the field definition
 */
module.exports = definition => {
  let generator = undefined;
  const type = definition.type;

  switch (type) {
    case String:
      generator = () => require('./generateString')(definition);
      break;
    case Number:
      generator = () => require('./generateNumber')(definition);
      break;
    case Boolean:
      generator = () => require('./generateBoolean')(definition);
      break;
    case Date:
      generator = () => require('./generateDate')(definition);
      break;
  }

  return generator;
};
