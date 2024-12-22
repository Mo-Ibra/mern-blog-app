const formatDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
}

console.log(formatDate('2024-12-21T01:46:58.000Z'));

module.exports = formatDate;