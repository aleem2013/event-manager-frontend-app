// i18next-scanner.config.js
module.exports = {
    input: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.test.{js,jsx,ts,tsx}',
      '!src/i18n/**',
      '!**/node_modules/**',
    ],
    output: './public/locales',
    options: {
      debug: true,
      removeUnusedKeys: true,
      sort: true,
      func: {
        list: ['t', 'i18next.t', 'i18n.t'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      trans: {
        component: 'Trans',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      lngs: ['en', 'es'],
      ns: ['translation'],
      defaultLng: 'en',
      defaultNs: 'translation',
      defaultValue: '',
      resource: {
        loadPath: 'public/locales/{{lng}}/{{ns}}.json',
        savePath: '{{lng}}/{{ns}}.json',
      },
      nsSeparator: ':',
      keySeparator: '.',
    },
  };