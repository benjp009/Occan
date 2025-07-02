import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin');
    } else {
      alert('Invalid password');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-2 mb-4"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2">
          Login
        </button>
      </form>
    </div>
  );
}
