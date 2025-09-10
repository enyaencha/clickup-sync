// Test setup and global mocks
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'clickup_sync_test';

// Mock console.log in tests
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};
