const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const validateModel = (prisma, modelName, data, fieldsToOmit) => {
  // Get the model map from the _baseDmmf property
  const modelMap = prisma._baseDmmf.modelMap;
  // Get the model definition for the specified model
  const model = modelMap[modelName];
  // Initialize arrays to store missing and invalid fields
  const missingFields = [];
  const invalidFields = [];
  const invalidFieldsArray = [];
  // Omit the specified fields and relations from the model definition
  if (model) {
    if (model && fieldsToOmit) {
      model.fields = model.fields.filter(
        (field) => !fieldsToOmit.includes(field.name)
      );
    }
    model.fields = model.fields.filter((field) => !field.relationName);

    // Check for required fields in the model definition
    const requiredFields = model.fields
      .filter((field) => field.isRequired)
      .map((field) => field.name);

    requiredFields.forEach((field) => {
      if (!data[field]) {
        missingFields.push(field);
      }
    });
    if (missingFields.length > 0) {
      console.error(
        `The following required fields are missing in data: ${missingFields.join(
          ", "
        )}`
      );
    }
  } else {
    console.error(`Model ${modelName} not found in schema`);
    return `Error: model ${modelName} not found in schema`;
  }
  // Implement custom validation logic
  model.fields.forEach((field) => {
    const expectedType = field.type.toLowerCase();
    if (expectedType === "int" || expectedType === "float") {
      if (isNaN(data[field.name])) {
        invalidFields.push({
          model: modelName,
          fieldName: field.name,
          error: ` Field has incorrect type. Expected ${expectedType}, got ${typeof data[
            field.name
          ]}`,
        });
        invalidFieldsArray.push(field.name);
      }
    } else if (expectedType === "date" || expectedType === "datetime") {
      // Check if the value is a valid ISO string
      if (
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z$/.test(
          data[field.name]
        )
      ) {
        invalidFields.push({
          model: modelName,
          fieldName: field.name,
          error: `Field has incorrect type. Expected ${expectedType}, got ${typeof data[
            field.name
          ]}`,
        });
        invalidFieldsArray.push(field.name);
      }
    } else if (typeof data[field.name] !== expectedType) {
      invalidFields.push({
        model: modelName,
        fieldName: field.name,
        error: `Field has incorrect type. Expected ${expectedType}, got ${typeof data[
          field.name
        ]}`,
      });
      invalidFieldsArray.push(field.name);
    }
  });

  return { invalidFields, invalidFieldsArray, missingFields };
};

console.log(
  validateModel(
    prisma,
    "Expenditure",
    {
      amount: "10009a",
      description: "hansi",
      unitId: 1,
      termId: 2,
      date: "11/11/2011",
    },
    ["id", "budgetRequestId", "createdAt", "date"]
  )
);
