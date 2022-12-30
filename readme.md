# Prisma Validate

Prisma Validate is a JavaScript library that allows you to easily validate your data against a Prisma schema. It helps you ensure that your data is consistent with the types and requirements defined in your Prisma schema, making it easier to prevent errors and improve the quality of your data.

## Installation

install Prisma Validate, run the following command in your terminal:

```javascript
npm install prisma-validate
```

## Usage/Examples

To use Prisma Validate, you'll need to import the validateModel function and pass in your Prisma client instance, the name of the model you want to validate, and the data you want to validate. Optionally, you can also pass in an array of fields to omit from the validation process.

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { validateModel } = require("prisma-validate");

const result = validateModel(
  prisma,
  "User",
  {
    name: "John",
    email: "john@example.com",
    age: 30,
  },
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
  missingFields: []
}

```

## Author

Hanis Hapsa

- [@codehive](https://github.com/hapsaboi)
