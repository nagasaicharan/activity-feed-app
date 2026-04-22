// Mock twrnc
jest.mock('twrnc', () => ({
  create: jest.fn(() => {
    const tw = jest.fn((str) => ({ style: str }));
    tw.color = jest.fn((color) => color);
    return tw;
  }),
  useDeviceContext: jest.fn(),
}));
