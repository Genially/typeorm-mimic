'use strict';

/**
 * Generates the definition from the given typeorm schema path
 *
 * @param {object} path the typeorm schema path
 * @return {object}
 *  an object with the information of the given schema path in the following format:
 * {
 *  type: String <type name>,
 *  required: Boolean <this path is required>,
 *  default: Any <default path value>,
 *  isEnum: Boolean <if path only accepts enumerations>,
 *  enum: Array <path enumeration if isEnum is true>,
 *  isArray: Boolean <if the path is an array>
 * }
 */
const generateDefinition = path => {
  return {
    type: Array.isArray(path.type) ? path.type[0] : path.type,
    required: !path.nullable,
    default: typeof path.default === 'function' ? path.default() : path.default,
    isEnum: Array.isArray(path.enum),
    enum: path.enum,
    isArray: path.array || Array.isArray(path.type)
  };
};

/**
 * Generates an effective schema from the given typeorm schema definition
 *
 * @param {object} schemaDefinition typeorm schema definition
 * @returns {object}
 * an object with the definition of each schema path, with the following format:
 * {
 *   <path name>: <path definition>
 * }
 */
const generateEffectiveSchema = schemaDefinition => {
  const effectiveSchema = {};

  for (let pathName in schemaDefinition) {
    const path = schemaDefinition[pathName];

    if (path) {
      effectiveSchema[pathName] = generateDefinition(path);
    }
  }

  return effectiveSchema;
};

module.exports = generateEffectiveSchema;
