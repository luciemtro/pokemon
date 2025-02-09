/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};
module.exports = {
  plugins: [require("tailwindcss"), require("autoprefixer")],
};

export default config;
