import React, { useState } from "react";
import axios from "axios";

const ShowDatabase = () => {
  const [formData, setFormData] = useState({
    internshipType: "",
    searchQuery: "",
  });
  const [database, setDatabase] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/api/show-database?internshipType=${formData.internshipType}&searchQuery=${formData.searchQuery}`
      );
      setDatabase(response.data);
    } catch (error) {
      setMessage("Failed to fetch database.");
    }
  };

  const internshipOptions = [
    "Content Writing & Marketing",
    "Volunteering / Social Work",
    "Social Media Marketing",
    "Product & Online Marketing",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Show Database</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Internship Type</label>
            <select
              name="internshipType"
              value={formData.internshipType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            >
              <option value="">Select Internship</option>
              {internshipOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Search Applicant</label>
            <input
              type="text"
              name="searchQuery"
              value={formData.searchQuery}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              placeholder="Enter name to search"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white p-2 rounded mt-4 hover:bg-red-600"
          >
            Show Database
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        {database.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">Applicant Data</h2>
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Phone</th>
                  <th className="py-2 px-4 border">Gender</th>
                  <th className="py-2 px-4 border">City</th>
                </tr>
              </thead>
              <tbody>
                {database.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border">{item.name}</td>
                    <td className="py-2 px-4 border">{item.email}</td>
                    <td className="py-2 px-4 border">{item.phone}</td>
                    <td className="py-2 px-4 border">{item.gender}</td>
                    <td className="py-2 px-4 border">{item.currentCity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowDatabase;
