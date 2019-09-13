# typeorm-mimic

typeorm-mimic is a simple (but powerful) Node.js library to generate test data using only the TypeORM schema.

## Features

- Generate random values depending on primitive data types (String, Number, Boolean, Date...)
- Generate custom values for specific fields
- Generate custom values that match non-primitive data types (email, phone, address...)
- Ignore fields
- Generate dates as object or string

## Installation

```
npm install @genially/typeorm-mimic
```

## Usage

### mimic(model, opts)

Generates a mimetic document from `schemaDefinition`

- `schemaDefinition`: TypeORM schema definition
- `opts`: Generation options, where the options are in the following format:

```js
        {
          ignore: Array,
          datesAsString: Boolean,
          custom: {
             field: {
               value: Any,
               type: String
             }
          }
        }
```

|       Option       | Type    | Usage                                                                                                                                                                                                              |
| :----------------: | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|       ignore       | Array   | It can contains string paths or RegExp of fields to ignore during generation                                                                                                                                       |
|   datesAsString    | Boolean | Return dates as Date or String                                                                                                                                                                                     |
|       custom       | Object  | Special generator for specific fields                                                                                                                                                                              |
| custom.field.value | Any     | Predefined value to the given field                                                                                                                                                                                |
| custom.field.type  | String  | Data type to generate to the given field, in the format: "type.subtype". Examples: "internet.email" or "address.city". See [Faker.js](https://github.com/marak/Faker.js/) methods to know all supported data types |

---

## Usage Example

```js
const { EntitySchema } = require('typeorm');
const mimic = require('@genially/typeorm-mimic');

const schemaDefinition = new EntitySchema({
  name: 'Test',
  columns: {
    name: {
      type: String,
      default: 'Mimic'
    },
    address: {
      type: String,
      nullable: true
    },
    email: {
      type: String
    },
    phones: {
      type: [String]
    },
    birth_date: {
      type: Date
    },
    role: {
      enum: [0, 1, 2]
    },
    is_student: {
      type: Boolean
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }
});

const randomObject = mimic(schemaDefinition, {
  ignore: ['address'],
  datesAsString: false,
  custom: {
    email: {
      type: 'internet.email'
    },
    phones: {
      type: 'phone.phoneNumber'
    },
    birth_date: {
      value: () => new Date('December 25, 1995 23:15:30')
    }
  }
});

console.log(randomObject);

/*
{
    name: "Mimic",
    email: 'Timmothy_Wuckert@gmail.com',
    birth_date: "1995-12-25T22:15:30.000Z",
    phones: [
      '(857) 375-1663',
      '(601) 926-2014',
      '(705) 324-8873 x9541',
      '(693) 690-3304 x99775',
      '1-088-666-8801 x6452',
      '1-125-206-1792',
      '607.384.4536',
      '228.058.0088 x91535'
    ],
    role: 0,
    birth_date: 1995-12-25T22:15:30.000Z,
    is_student: false,
    created_at: 1568388626896
}
*/
```

## Testing

To run the test cases use `npm test`

## Related packages

typeorm-mimic is strongly inspired by [mongoose-mimic](https://github.com/Genially/mongoose-mimic), which provides similar features to Mongoose ODM.

## License

Licensed under [MIT](LICENSE)
