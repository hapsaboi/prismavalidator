# Prisma Validator

Prisma Validate is a JavaScript library that allows you to easily validate your data against a Prisma schema. It helps you ensure that your data is consistent with the types and requirements defined in your Prisma schema, making it easier to prevent errors and improve the quality of your data.

## Installation

install Prisma Validate, run the following command in your terminal:

```javascript
npm install prismavalidator
```

## Arguments.

The validate function takes in the following arguments:

- prisma: an instance of the Prisma client, which allows us to access the data model definitions in the Prisma schema.
- modelName: a string representing the name of the model we want to validate against.
- data: an object containing the data we want to validate. The keys in this object should match the field names in the specified model, and the values should be the data we want to validate.
- fieldsToOmit (optional): an array of field names to omit from the validation process. This can be useful if you want to exclude certain fields from validation (e.g. createdAt, updatedAt).
- configuration (optional): an object containing additional validation rules for specific fields. The keys in this object should match the field names in the specified model, and the values should be objects containing the following properties:
  - minLength: the minimum allowed length for the field.
  - maxLength: the maximum allowed length for the field.
  - regex: a regular expression that the field must match.

The function returns an object with the following properties:

- invalidFields: an array of objects containing information about fields that did not pass validation. Each object has the following properties:
  - model: the name of the model the field belongs to.
  - fieldName: the name of the field that failed validation.
  - error: a string describing the validation error.
- invalidFieldsArray: an array containing the names of the fields that failed validation.
- missingFields: an array of field names that are required but were not present in the data object.
- error: a string that return an error message that can be displayed to the user.
- isValid: a boolean value that tells us if the validation was successful.

## Usage/Examples

To use Prisma Validate, you'll need to import the validateModel function and pass in your Prisma client instance, the name of the model you want to validate, and the data you want to validate. Optionally, you can also pass in an array of fields to omit from the validation process.

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { validateModel } = require("prisma-validate");

const result = validateModel(
  //instance of prisma
  prisma,
  //name of model
  "User",
  //data to validate
  {
    name: "John",
    email: "john@example.com",
    age: 30,
  },
  //attributes to omit
  ["id"]
);
```

The validateModel function will return an object containing two keys: invalidFields and missingFields. invalidFields is an array of objects, each representing a field with an incorrect type. missingFields is an array of strings, representing the names of required fields that are missing in the data.

```javascript
console.log(result);
// {
//   invalidFields: [],
//   invalidFieldsArray: [],
//   missingFields: []
//   error: ""
//   isValid: bool
// }
```

## Custom Validation Rules

You can specify custom validation rules by passing in an additional configuration object as the fourth parameter. This object should have keys that correspond to the field names in your model and values that are functions that return a boolean value.

Note: The validateModel function currently only supports minLength and maxLength validation for string fields, and regex validation for any field type. More validation rules can be easily added as needed.

```javascript
const data = {
  name: "John",
  email: "john@example.com",
  password: "password",
};

const configuration = {
  name: {
    minLength: 2,
    maxLength: 50,
    regex: "/^[A-Z]{3}$/",
  },
  email: {
    minLength: 5,
    maxLength: 50,
  },
  password: {
    minLength: 8,
    maxLength: 50,
  },
};

const validationResult = validateModel(
  prisma,
  "User",
  data,
  ["id"],
  configuration
);
```

## Implementation

```javascript
const data = {
  name: "Hanis",
  email: "John@gmail.com",
  password: "short",
};

const configuration = {
  name: {
    minLength: 10,
    maxLength: 50,
    regex: "/^[A-Z]{3}$/",
  },
  email: {
    minLength: 20,
    maxLength: 50,
  },
  password: {
    minLength: 3,
    maxLength: 50,
  },
};

const result = validateModel(prisma, "User", data, configuration);

console.log(result);

Output:

{
  invalidFields: [
    {
      model: 'User',
      fieldName: 'name',
      error: 'Field does not match required pattern'
    },
    {
      model: 'User',
      fieldName: 'email',
      error: 'Field does not meet minimum length requirement of 20'
    }
  ],
  invalidFieldsArray: [ 'name', 'email', 'password' ],
  missingFields: [],
  error: "Validation failed for the following field(s): firstname, lastname, type, ministryId, name",
  isValid:false
}

```

## Author

Hanis Hapsa

- [@codehive](https://github.com/hapsaboi)

## Support

To report any bug or suggest a feature update, kindly join the discord channel below.
(https://discord.gg/kpyXeneeVq)
