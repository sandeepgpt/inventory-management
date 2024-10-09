"use client";

import { useState, useRef } from 'react';
import { useGetUsersQuery, useCreateUserMutation } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
];

const Users = () => {
  const { data: users, isError, isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation(); // Create user mutation
  const printRef = useRef(null); // Reference to the area to be printed

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const userId = new Date().toISOString(); // Use current date as userId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setErrorMessage('Please provide both a name and an email.');
      return;
    }

    try {
      await createUser({ userId, name, email }).unwrap(); // Send the new user data
      alert('User created successfully!');
      setName(''); // Reset form fields
      setEmail('');
      setErrorMessage(''); // Clear any error message
    } catch (error) {
      console.error('Failed to create user:', error);
      setErrorMessage('Error creating user, please try again.');
    }
  };

  const handlePrint = () => {
    window.print(); // Trigger print dialog
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !users) {
    return <div className="text-center text-red-500 py-4">Failed to fetch users</div>;
  }

  return (
    <div className="flex flex-col">
           {/* User Creation Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input type="hidden" value={userId} /> {/* Hidden userId input */}
          <div className="flex items-center space-x-2">
            <label htmlFor="name" className="text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              className="p-2 border rounded"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="email" className="text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="p-2 border rounded"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create User
          </button>
        </form>
      </div>

  <div>
     <div className="flex justify-between items-center mb-4">
        <Header name="Users" />
        <button
          onClick={handlePrint}
          className="px-2 py-1 bg-blue-400 text-white rounded hover:bg-blue-600 transition duration-300 text-sm"
        >
         Print Users
        </button>

      </div>
      {/* DataGrid to display users */}
      <div ref={printRef}> {/* Print area reference */}
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.userId}
          checkboxSelection
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
        />
       </div>
   </div>
    </div>
  );
};

export default Users;
