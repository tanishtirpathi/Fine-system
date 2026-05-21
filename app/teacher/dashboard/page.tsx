"use client"
import React, { useEffect, useState } from 'react';

const TeacherDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('An error occurred while fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">User Details</h1>
        <pre className="bg-gray-200 p-4 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TeacherDashboard;