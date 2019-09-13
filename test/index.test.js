const { EntitySchema } = require('typeorm');
const mimic = require('../src');
const { validateEmail } = require('./utils');

describe('typeorm-mimic', () => {
  let schemaDefinition;

  beforeAll(async () => {
    schemaDefinition = new EntitySchema({
      name: 'Test',
      columns: {
        name: {
          type: String,
          nullable: false
        },
        address: {
          type: String,
          default: 'fake address'
        },
        score: {
          type: Number
        },
        created_at: {
          type: Date
        },
        phones: {
          type: [String]
        },
        is_student: {
          type: Boolean
        },
        gender: {
          enum: [0, 1]
        }
      }
    });
  });

  describe('typeorm schema definition', () => {
    it('should generate random document', () => {
      const randomObject = mimic(schemaDefinition);

      expect(randomObject.name).toBeString();
      expect(randomObject.address).toBe('fake address');
      expect(randomObject.score).toBeNumber();
      expect(randomObject.created_at).toBeDate();
      expect(randomObject.phones).toBeArray();
      expect(randomObject.is_student).toBeBoolean();
      expect(randomObject.gender).toBeNumber();
    });
  });

  describe('typeorm schema definition with ignored fields', () => {
    it('should generate random document without ignored fields', () => {
      const ignoredFields = ['is_student', 'phones'];
      const randomObject = mimic(schemaDefinition, {
        ignore: ignoredFields
      });

      expect(randomObject.is_student).toBeUndefined();
      expect(randomObject.phones).toBeUndefined();
    });
  });

  describe('typeorm schema definition with custom fields', () => {
    it('should generate random document with custom fields', () => {
      const randomObject = mimic(schemaDefinition, {
        custom: {
          name: { type: 'internet.email' },
          score: { value: 100 },
          is_student: {
            value: () => true
          }
        }
      });

      expect(validateEmail(randomObject.name)).toBeTrue();
      expect(randomObject.score).toBe(100);
      expect(randomObject.is_student).toBeTrue();
    });
  });

  describe('typeorm schema definition with datesAsString to true', () => {
    it('should generate random document with date as string', () => {
      const randomObject = mimic(schemaDefinition, { datesAsString: true });

      expect(randomObject.created_at).toBeString();
    });
  });

  describe('typeorm schema definition with custom array type', () => {
    it('should generate random document with array whose content meets the array type', () => {
      const randomObject = mimic(schemaDefinition, {
        custom: { phones: { type: 'internet.email' } }
      });

      expect(randomObject.phones).toBeArray();
      expect(validateEmail(randomObject.phones[0])).toBeTrue();
    });
  });
});
