module.exports = {
    toLowerCase,
    formatArrayToPipeSeparatedString,
  };

function toLowerCase(text) {
    if (typeof text !== 'string') {
      throw new TypeError('Input must be a string');
    }
    return text.toLowerCase();
  }

  // Utility function to convert array to pipe-separated string
function formatArrayToPipeSeparatedString(arr) {
  return arr ? arr.join('|') : '';
}