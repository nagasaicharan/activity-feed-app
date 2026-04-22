module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!.pnpm|((jest-)?react-native|@react-native(-community)?|@react-navigation|@nozbe|lucide-react-native|moti|react-redux|uuid|immer)/)',
  ],
};
