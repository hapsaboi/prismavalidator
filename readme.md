# Prisma Validate

Prisma Validate is a JavaScript library that allows you to easily validate your data against a Prisma schema. It helps you ensure that your data is consistent with the types and requirements defined in your Prisma schema, making it easier to prevent errors and improve the quality of your data.

## Installation

install Prisma Validate, run the following command in your terminal:

`npm install prisma-validate`

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

```
console.log(result);
// {
//   invalidFields: [],
//   invalidFieldsArray: [],
//   missingFields: []
// }
```
