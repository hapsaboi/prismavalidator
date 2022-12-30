Introduction
This npm package allows you to validate data against a Prisma model. You can specify which fields to omit from the validation and the package will check for missing required fields and invalid field types.

Installation
To install the package, run the following command:
npm install prisma-validator

Usage
To use the package, require it in your code and pass in the Prisma client, the model name, the data to be validated, and an array of fields to omit from the validation.

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const prismaValidator = require("prisma-validator");

const data = {
amount: "10009a",
description: "hansi",
unitId: 1,
termId: 2,
date: "11/11/2011",
};

const fieldsToOmit = ["id", "budgetRequestId", "createdAt", "date"];

const validationResult = prismaValidator(
prisma,
"Expenditure",
data,
fieldsToOmit
);

console.log(validationResult);
