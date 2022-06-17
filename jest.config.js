module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json'
        }
    },
    coverageThreshold: {
        global: {
            lines: 80,
        },
    },
    moduleFileExtensions: [
        'ts',
        'js'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    testMatch: [
        '**/__test__/**/*.spec.(ts|js)'
    ],
    testEnvironment: 'node'
};
