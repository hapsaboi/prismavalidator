const { isValidDate } = require("./helper");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const validateModel = (
  prisma,
  modelName,
  data,
  fieldsToOmit,
  configuration
) => {
  // Get the model map from the _baseDmmf property
  const modelMap = prisma._baseDmmf.modelMap;
  // Get the model definition for the specified model
  const model = modelMap[modelName];
  // Initialize arrays to store missing and invalid fields
  const missingFields = [];
  const invalidFields = [];
  const invalidFieldsArray = [];

  if (model) {
    // Omit the specified fields and relations from the model definition
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
  } else {
    console.error(`Model ${modelName} not found in schema`);
    return `Error: model ${modelName} not found in schema`;
  }
  // Implement custom validation logic
  (model.fields || []).forEach((field) => {
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

      if (!isValidDate(data[field.name])) {
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

  // Check for additional validation rules
  // Loop through the configuration object
  Object.entries(configuration || []).forEach(([fieldName, rules]) => {
    // Get the value of the field in the data object
    const fieldValue = data[fieldName];

    // Define functions for each rule
    const checkMinLength = () => {
      if (fieldValue.length < rules.minLength) {
        isValid = false;
        invalidFields.push({
          model: modelName,
          fieldName,
          error: `Field does not meet minimum length requirement of ${rules.minLength}`,
        });
      }
      {
        !invalidFieldsArray.includes(fieldName)
          ? invalidFieldsArray.push(fieldName)
          : null;
      }
    };
    const checkMaxLength = () => {
      if (fieldValue.length > rules.maxLength) {
        isValid = false;
        invalidFields.push({
          model: modelName,
          fieldName,
          error: `Field exceeds maximum length of ${rules.maxLength}`,
        });
      }
      {
        !invalidFieldsArray.includes(fieldName)
          ? invalidFieldsArray.push(fieldName)
          : null;
      }
    };
    const checkRegex = () => {
      if (!new RegExp(rules.regex).test(fieldValue)) {
        isValid = false;
        invalidFields.push({
          model: modelName,
          fieldName,
          error: `Field does not match required pattern`,
        });
      }
      {
        !invalidFieldsArray.includes(fieldName)
          ? invalidFieldsArray.push(fieldName)
          : null;
      }
    };

    // Call the appropriate function for each rule
    if (rules.minLength) checkMinLength();
    if (rules.maxLength) checkMaxLength();
    if (rules.regex) checkRegex();
  });

  let error = "";
  let isValid = true;
  if (missingFields.length > 0) {
    error += `The following required field(s) are missing: ${missingFields.join(
      ", "
    )}. `;
  }

  if (invalidFieldsArray.length > 0) {
    error += ` --- Validation failed for the following field(s): ${invalidFields
      .map((error) => `${error.fieldName}`)
      .join(", ")}`;
  }

  if (error !== "") {
    isValid = false;
  }

  return { invalidFields, invalidFieldsArray, missingFields, error, isValid };
};

module.exports = { validateModel };
