module.exports = {
    trailingComma: 'es5',
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    useTabs: false,
    overrides: [
        {
            files: ['*.json'],
            options: {
                tabWidth: 2,
            },
        },
        {
            files: ['*.html'],
            options: {
                printWidth: 120,
            },
        },
    ],
};
