"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [role, setRole] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password, role }),
      });

      if (response.ok) {
        alert('Login successful!');
        if (role === 'teacher') {
          router.push('/teacher/dashboard');
        } else if (role === 'student') {
          router.push('/student/dashboard');
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 bg-white/10 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setIdentifier(''); // Reset identifier when role changes
              }}
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-300 mb-2">
              {role === 'student' ? 'Roll Number' : 'Email Address'}
            </label>
            <input
              type={role === 'student' ? 'text' : 'email'}
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              setError('');
            }}
          >
            {error ? 'Login' : 'Logging in...'}
          </button>
        </form>
      </div>
    </div>
  );
}