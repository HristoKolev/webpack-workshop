import { formatDate } from '~helpers';
import logoUrl from '~logo.png';
import { useEffect, useState } from 'react';

export const App = (): JSX.Element => {
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    fetch('http://localhost:3001/')
      .then((res) => res.text())
      .then(setMessage)
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }, []);

  return (
    <div className="text">
      <div>Hello Webpack</div>
      <div data-testid="date-label">{formatDate(new Date())}</div>
      {message && <div data-testid="server-message">{message}</div>}
      <div>
        <img src={logoUrl} alt="logo" />
      </div>
    </div>
  );
};
