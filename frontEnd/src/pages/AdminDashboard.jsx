import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const AdminDashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalResidents: 0, availableVacancies: 0, pendingTickets: 0 });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const refreshData = async () => {
    try {
      // Fetch stats pipeline
      const statsRes = await API.get('/dashboard/stats');
      setStats(statsRes.data);

      // Fetch student database profiles
      const studentsRes = await API.get('/students');
      setStudents(studentsRes.data);
    } catch (err) {
      console.error("Failed to sync backend records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await API.post('/rooms', { roomNumber, capacity: Number(capacity) });
      setFormMessage(`Room ${roomNumber} created successfully!`);
      setRoomNumber('');
      setCapacity('');
      refreshData(); // Refresh cards instantly
    } catch (err) {
      setFormMessage(err.response?.data?.message || 'Failed to add room');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Workspace</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, <strong>{user?.name}</strong></span>
          <button onClick={logoutUser} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition font-medium">
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 font-medium">Syncing Infrastructure metrics...</div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Analytical Metrics Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-600">
              <h3 className="text-gray-500 text-sm font-medium">Total Residents</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalResidents}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-emerald-500">
              <h3 className="text-gray-500 text-sm font-medium">Available Vacancies</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.availableVacancies}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-amber-500">
              <h3 className="text-gray-500 text-sm font-medium">Pending Tickets</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingTickets}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Operational Panel: Add Room */}
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Structural Room</h2>
              {formMessage && <p className="text-sm text-indigo-600 bg-indigo-50 p-2 rounded mb-4 font-medium">{formMessage}</p>}
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1 font-medium">Room Name/Number</label>
                  <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required placeholder="e.g., 102-B"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800" />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1 font-medium">Bed Capacity</label>
                  <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required placeholder="e.g., 4" min="1"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-2 rounded transition">
                  Create Room
                </button>
              </form>
            </div>

            {/* Data Table Panel: Student Database Profiles */}
            <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Registered Resident Records</h2>
              {students.length === 0 ? (
                <p className="text-gray-500 text-sm">No resident student records logged in database yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 text-sm uppercase bg-gray-50">
                        <th className="py-3 px-4 font-medium">Name</th>
                        <th className="py-3 px-4 font-medium">Email</th>
                        <th className="py-3 px-4 font-medium">Phone</th>
                        <th className="py-3 px-4 font-medium">Assigned Room</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm divide-y">
                      {students.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50 transition">
                          <td className="py-3 px-4 font-medium text-gray-900">{student.userId?.name || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-500">{student.userId?.email || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-500">{student.phone}</td>
                          <td className="py-3 px-4">
                            {student.roomId ? (
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold text-xs">
                                Room {student.roomId.roomNumber}
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold text-xs">
                                Unallocated
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;