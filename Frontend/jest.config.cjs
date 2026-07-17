/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],

  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(lucide-react|clsx|tailwind-merge)/)',
  ],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|webp|svg|ico|ttf|woff|woff2|eot)$':
      '<rootDir>/src/tests/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/$1',
    '^motion/react$': '<rootDir>/src/tests/__mocks__/motionMock.js',
    '^react-toastify$': '<rootDir>/src/tests/__mocks__/reactToastifyMock.js',
  },

  testMatch: [
    '<rootDir>/src/**/*.test.[jt]s',
    '<rootDir>/src/**/*.test.[jt]sx',
  ],

  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/tests/**',
    '!src/main.jsx',
    '!src/index.css',
    '!src/**/*.test.{js,jsx}',
    '!src/assets/**',
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  maxWorkers: '50%',
};
