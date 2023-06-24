import { render, screen } from '@testing-library/react';
import { App } from '~App';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { format } from 'date-fns';

const server = setupServer(
  rest.get('http://localhost:3001/', (_req, res, ctx) =>
    res(ctx.text('Hello from the server!'))
  )
);

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

test('App renders data', async () => {
  render(<App />);
  expect(screen.getByText('Hello Webpack')).toBeInTheDocument();
  expect(screen.getByTestId('date-label')).toHaveTextContent(
    format(new Date(), 'dd MMM yyyy')
  );

  const serverMessage = await screen.findByTestId('server-message');

  expect(serverMessage).toHaveTextContent('Hello from the server!');
});
