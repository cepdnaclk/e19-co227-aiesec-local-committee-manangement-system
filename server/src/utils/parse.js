// converts json object to key value arrays
// key values which are in camelCase are converted to snake_case
function requestBodyToFieldsAndValues(body) {
  const fields = [];
  const values = [];

  if (body) {
    for (const key in body) {
      fields.push(
        key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      );
      values.push(`'${body[key]}'`);
    }
  }

  return [fields, values];
}

function objectKeysSnakeToCamel(snakeCaseObject) {
  let camelCaseObject = {};
  for (let snakeCaseKey in snakeCaseObject) {
    let camelCaseKey = snakeCaseKey.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );
    camelCaseObject[camelCaseKey] = snakeCaseObject[snakeCaseKey];
  }
  return camelCaseObject;
}

module.exports = { requestBodyToFieldsAndValues, objectKeysSnakeToCamel };
