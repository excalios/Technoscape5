module.exports = {
    root: true,
    extends: 'airbnb-typescript/base',
    plugins: ['import', 'prettier'],
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
    rules: {
        indent: 'off',
        '@typescript-eslint/indent': ['error', 4],
    },
};
