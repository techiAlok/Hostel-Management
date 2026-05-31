import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const AdminDashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalResidents: 0, availableVacancies: 0, pendingTickets: 0 });
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Form states
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [formMessage, setFormMessage] = useState('');
  
  // Quick allocation state handlers
  const [allocatingStudentId, setAllocatingStudentId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [allocationMessage, setAllocationMessage] = useState('');

  // Admin approval management state handlers (SuperAdmin Only)
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [adminActionMessage, setAdminActionMessage] = useState('');

  // Ticket Management State Handler
  const [tickets, setTickets] = useState([]);

  // 🚀 BRAND NEW: Local state for selected status filter
  const [filterStatus, setFilterStatus] = useState('All');

  const refreshData = async () => {
    try {
      const statsRes = await API.get('/dashboard/stats');
      setStats(statsRes.data);

      const studentsRes = await API.get('/students');
      setStudents(studentsRes.data);

      const roomsRes = await API.get('/rooms');
      setRooms(roomsRes.data);

      // FETCH ALL TICKETS LIVE
      const ticketsRes = await API.get('/tickets');
      setTickets(ticketsRes.data);

      if (user?.role === 'superadmin') {
        const pendingAdminsRes = await API.get('/auth/pending-admins');
        setPendingAdmins(pendingAdminsRes.data);
      }
    } catch (err) {
      console.error("❌ Failed to sync backend records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await API.post('/rooms', { roomNumber, capacity: Number(capacity) });
      setFormMessage(`Room ${roomNumber} created successfully!`);
      setRoomNumber('');
      setCapacity('');
      refreshData();
    } catch (err) {
      setFormMessage(err.response?.data?.message || 'Failed to add room');
    }
  };

  const handleAllocateRoom = async (studentId) => {
    if (!selectedRoomId) return;
    
    try {
      setAllocationMessage('');
      console.log("🚀 Dispatching Allocation IDs to API server:", { studentId, roomId: selectedRoomId });

      await API.post('/rooms/allocate', { 
        studentId: studentId, 
        roomId: selectedRoomId 
      });

      setAllocationMessage('Room allocated successfully!');
      setAllocatingStudentId(null);
      setSelectedRoomId('');
      await refreshData();
    } catch (err) {
      console.error("❌ Allocation Request Error Body:", err.response?.data);
      setAllocationMessage(err.response?.data?.message || 'Allocation request failed.');
    }
  };

  const handleAuthorizeAdmin = async (adminId, approveStatus) => {
    try {
      setAdminActionMessage('');
      await API.put(`/auth/authorize-admin/${adminId}`, { approved: approveStatus });
      setAdminActionMessage(`Admin registration ${approveStatus ? 'approved' : 'rejected'} successfully.`);
      refreshData();
    } catch (err) {
      setAdminActionMessage(err.response?.data?.message || 'Authorization change failed.');
    }
  };

  // Action handler to resolve a specific ticket
  const handleResolveTicket = async (ticketId) => {
    try {
      await API.put(`/tickets/${ticketId}/resolve`);
      await refreshData(); // Re-fetch statistical counters and data dynamically
    } catch (err) {
      console.error("❌ Failed to resolve service ticket object:", err);
    }
  };

  // 🚀 BRAND NEW: Instant client-side dropdown sorting array filter
  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus === 'All') return true;
    return ticket.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">Admin Workspace</h1>
          <span className="text-xs font-mono font-bold uppercase text-indigo-600 mt-0.5 tracking-wider">
            Clearance Level: {user?.role}
          </span>
        </div>
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
              <p className="text-3xl font-bold text-amber-500 mt-2">{stats.pendingTickets}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column Stack */}
            <div className="space-y-6 lg:col-span-1">
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

              {user?.role === 'superadmin' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-200">
                  <h2 className="text-lg font-bold text-purple-950 mb-2">Manager Authorization Keys</h2>
                  <p className="text-xs text-gray-500 mb-4">Review and approve administrative accounts requesting network clearance fields.</p>
                  
                  {adminActionMessage && <p className="text-xs text-purple-700 bg-purple-50 p-2 rounded mb-3 font-semibold">{adminActionMessage}</p>}
                  
                  {pendingAdmins.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No pending admin registration queries found.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {pendingAdmins.map((admin) => (
                        <div key={admin._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-gray-800">{admin.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{admin.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleAuthorizeAdmin(admin._id, true)} className="flex-1 text-xs font-bold bg-emerald-600 text-white py-1 rounded hover:bg-emerald-500 transition">
                              Approve
                            </button>
                            <button onClick={() => handleAuthorizeAdmin(admin._id, false)} className="flex-1 text-xs font-bold bg-gray-200 text-gray-700 py-1 rounded hover:bg-gray-300 transition">
                              Deny
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Data Table Panel: Student Database Profiles */}
            <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Registered Resident Records</h2>
              {allocationMessage && (
                <p className={`text-sm p-2 rounded mb-4 font-semibold ${allocationMessage.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {allocationMessage}
                </p>
              )}
              
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
                        <th className="py-3 px-4 font-medium text-right">Actions</th>
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
                          <td className="py-3 px-4 text-right">
                            {allocatingStudentId === student._id ? (
                              <div className="flex items-center gap-1 justify-end">
                                <select 
                                  value={selectedRoomId} 
                                  onChange={(e) => setSelectedRoomId(e.target.value)}
                                  className="p-1 border text-xs border-gray-300 rounded bg-white text-gray-800 focus:outline-none"
                                >
                                  <option value="">Select Room</option>
                                  {rooms
                                    .filter(r => r.vacancies > 0)
                                    .map(r => (
                                      <option key={r._id} value={r._id}>
                                        {r.roomNumber} ({r.vacancies} Left)
                                      </option>
                                    ))
                                  }
                                </select>
                                <button 
                                  onClick={() => handleAllocateRoom(student._id)} 
                                  className="bg-emerald-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-emerald-500 transition-colors"
                                >
                                  Save
                                </button>
                                <button onClick={() => setAllocatingStudentId(null)} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold hover:bg-gray-300">
                                  X
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => {
                                  setAllocatingStudentId(student._id);
                                  setSelectedRoomId('');
                                }} 
                                className="bg-indigo-50 border border-indigo-200 text-indigo-600 px-3 py-1 rounded text-xs font-bold hover:bg-indigo-600 hover:text-white transition"
                              >
                                {student.roomId ? 'Change Room' : 'Assign Room'}
                              </button>
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

          {/* Clean & Isolated Support Tickets Control Panel */}
          <div className="bg-white p-6 rounded-lg shadow-sm w-full border border-gray-200">
            {/* 🚀 FIXED UPGRADE: Flex layout with aligned drop-down sorter menu */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-lg font-bold text-gray-800">Grievance & Maintenance Support Tickets</h2>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Filter Logs:</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded bg-gray-50 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-40"
                >
                  <option value="All">Show All Tickets</option>
                  <option value="Pending">Only Pending</option>
                  <option value="Resolved">Only Resolved</option>
                  <option value="Cancelled">Only Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 text-sm uppercase bg-gray-50">
                    <th className="py-3 px-4 font-medium">Student Info</th>
                    <th className="py-3 px-4 font-medium">Grievance Parameters</th>
                    <th className="py-3 px-4 font-medium">Category</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Action Desk</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm divide-y">
                  {/* 🚀 FIXED UPGRADE: Iterate directly on filteredTickets array log map */}
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-400 italic">No matching student support requests found in this grid view.</td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket._id} className="hover:bg-gray-50 transition">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-gray-950">{ticket.studentId?.name || 'Resident Student'}</p>
                          <p className="text-xs text-gray-400 font-mono">{ticket.studentId?.email || 'N/A'}</p>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-medium text-gray-900">{ticket.title}</p>
                          <p className="text-xs text-gray-500 truncate">{ticket.description}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-xs font-medium rounded-full text-indigo-700">
                            {ticket.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {/* 🚀 FIXED UPGRADE: Multi-color conditional text highlighting based on live fields */}
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                            ticket.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            ticket.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' : 
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {ticket.status === 'Pending' ? 'Pending Review' : ticket.status === 'Cancelled' ? 'Cancelled' : 'Resolved'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {ticket.status === 'Pending' ? (
                            <button onClick={() => handleResolveTicket(ticket._id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded transition shadow-sm">
                              Mark Resolved
                            </button>
                          ) : ticket.status === 'Cancelled' ? (
                            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 italic">
                              No Actions (User Cancelled)
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 italic">
                              Resolved ✔
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;