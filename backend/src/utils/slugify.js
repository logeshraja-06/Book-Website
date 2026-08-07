// Reusable slugify utility for books, authors, and categories
const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // normalize accented characters
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ''); // strip leading and trailing hyphens
};

module.exports = slugify;
