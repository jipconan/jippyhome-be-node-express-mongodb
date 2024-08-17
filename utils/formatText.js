module.exports = {
    toLowerCase,
  };

function toLowerCase(text) {
    if (typeof text !== 'string') {
      throw new TypeError('Input must be a string');
    }
    return text.toLowerCase();
  }
