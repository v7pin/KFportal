import React, { useState, useEffect } from "react";
import axios from "axios";

const ProvideCertificate = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dateOfJoining: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClaims = async () => {
      const response = await axios.get("http://localhost:5000/api/claims");
      setClaims(response.data);
    };

    fetchClaims();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendCertificate = async () => {
    try {
      await axios.post("http://localhost:5000/api/send-certificate", {
        ...formData,
        id: selectedClaim.id,
      });
      setMessage("Certificate sent successfully!");
      setSelectedClaim(null);
      setFormData({ name: "", dateOfJoining: "" });
    } catch (error) {
      setMessage("Failed to send certificate.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Provide Certificate</h1>
        {message && <p className="text-center text-green-500 mb-4">{message}</p>}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Pending Claims</h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Claimed At</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td className="py-2 px-4 border">{claim.name}</td>
                  <td className="py-2 px-4 border">{claim.email}</td>
                  <td className="py-2 px-4 border">{claim.claimed_at}</td>
                  <td className="py-2 px-4 border">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => setSelectedClaim(claim)}
                    >
                      Send
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedClaim && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Send Certificate</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSendCertificate(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Date of Joining</label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setSelectedClaim(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvideCertificate;
