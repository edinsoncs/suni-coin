class BaseSchema {
  constructor(type) {
    this.type = type;
    this._required = false;
    this._hex = false;
    this._positive = false;
    this._allow = [];
  }
  required() { this._required = true; return this; }
  hex() { this._hex = true; return this; }
  positive() { this._positive = true; return this; }
  allow(...values) { this._allow.push(...values); return this; }
  _validateString(value, key) {
    if (typeof value !== 'string') return `${key} must be a string`;
    if (this._hex && !/^[0-9a-fA-F]+$/.test(value)) return `${key} must be a hex string`;
    return null;
  }
  _validateNumber(value, key) {
    const num = Number(value);
    if (!Number.isFinite(num)) return `${key} must be a number`;
    if (this._positive && num <= 0) return `${key} must be positive`;
    return null;
  }
  validate(value, key) {
    if (value === undefined || value === null || value === '') {
      if (this._required && !this._allow.includes(value)) {
        return { error: `${key} is required` };
      }
      return { value };
    }
    let err;
    if (this.type === 'string') err = this._validateString(value, key);
    if (this.type === 'number') err = this._validateNumber(value, key);
    if (err) return { error: err };
    if (this.type === 'number') value = Number(value);
    return { value };
  }
}

function string() { return new BaseSchema('string'); }
function number() { return new BaseSchema('number'); }
function object(schema) {
  return {
    validate(data = {}) {
      const result = {};
      for (const key of Object.keys(schema)) {
        const { error, value } = schema[key].validate(data[key], key);
        if (error) return { error };
        result[key] = value;
      }
      return { value: result };
    }
  };
}

function any() {
  return {
    validate(value) {
      return { value };
    }
  };
}

export default { string, number, object, any };
