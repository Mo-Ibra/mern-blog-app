function isValidURL(url) {
  const regex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
  return regex.test(url);
}

module.exports = isValidURL;