import { type JSX, useEffect, useState } from 'react';

import { formatDate } from 'src/helpers';
import logoUrl from '~logo.png';

export const App = (): JSX.Element => {
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    fetch('http://localhost:3001/')
      .then((res) => res.text())
      .then(setMessage)
      // eslint-disable-next-line no-console,@typescript-eslint/use-unknown-in-catch-callback-variable
      .catch(console.error);
  }, []);

  return (
    <div className="text">
      <div className="text-center">Hello Webpack</div>
      <div data-testid="date-label">{formatDate(new Date())}</div>
      {message && <div data-testid="server-message">{message}</div>}
      <div>
        <img src={logoUrl} alt="logo" />
      </div>
    </div>
  );
};
