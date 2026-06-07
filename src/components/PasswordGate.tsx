import { useState, type ReactNode } from 'react';

const AUTH_KEY = 'eink_auth';

interface PasswordGateProps {
  children: ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const password = import.meta.env.PUBLIC_ACCESS_PASSWORD;
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [authenticated, setAuthenticated] = useState(
    () => !!password && localStorage.getItem(AUTH_KEY) === password,
  );

  // No password configured → skip gate
  if (!password) return <>{children}</>;

  if (authenticated) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === password) {
      localStorage.setItem(AUTH_KEY, password);
      setAuthenticated(true);
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="w-64 flex flex-col items-center gap-4">
        <h1 className="font-bold" style={{ fontSize: "var(--text-lg)" }}>请输入密码</h1>
        <input
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          className="w-full border-2 border-black px-3 py-2 text-center bg-white outline-none"
          style={{ fontSize: "var(--text-base)" }}
          autoFocus
          placeholder="访问密码"
        />
        {error && <p className="font-bold" style={{ fontSize: "var(--text-sm)" }}>密码错误，请重试</p>}
        <button
          type="submit"
          className="w-full border-2 border-black bg-black text-white py-2 font-bold active:bg-white active:text-black"
          style={{ fontSize: "var(--text-base)" }}
        >
          进入
        </button>
      </form>
    </div>
  );
}
