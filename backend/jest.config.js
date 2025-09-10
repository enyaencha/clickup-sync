module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'controllers/**/*.js',
        'services/**/*.js',
        'utils/**/*.js'
    ],
    testMatch: ['<rootDir>/tests/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
