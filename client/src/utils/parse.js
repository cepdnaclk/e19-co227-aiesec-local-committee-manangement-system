// converts from camelCase string to Spaced
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

module.exports = requestBodyToFieldsAndValues;
