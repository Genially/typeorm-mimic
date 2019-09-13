const generateRandomDoc = require('./generateRandomDoc');
const generateEffectiveSchema = require('./generateEffectiveSchema');

module.exports = (schema, opts) => {
  const schemaDefinition = schema.options.columns || schema.columns || schema;
  const effectiveSchema = generateEffectiveSchema(schemaDefinition);
  return generateRandomDoc(effectiveSchema, opts);
};
