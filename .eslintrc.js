module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      modules: true
    }
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  globals: {
    google: true
  },
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'no-redeclare': 'off',
    'no-redeclare': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}