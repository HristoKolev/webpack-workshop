import { reportError } from './reportError';

test('logs the error to the console', () => {
  // eslint-disable-next-line no-console
  console.error = jest.fn();

  const error = new Error('test error');

  reportError(error);

  // eslint-disable-next-line no-console
  expect(console.error).toHaveBeenCalledWith(error);
});
