module.exports = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
      },
      testMatch: ['**/__tests__/**/*.(ts|tsx|js|jsx)'],
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.json',
        },
      },
    };
    