import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const StudentDashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ticket creation states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false); // New Spinner State

  // Individual Student Tickets Log State
  const [myTickets, setMyTickets] = useState([]);

  const fetchStudentProfileAndTickets = async () => {
    try {
      const { data } = await API.get('/students/me');
      setProfileData(data);

      const ticketsRes = await API.get('/tickets');
      const isolatedTickets = ticketsRes.data.filter(
        t => t.studentId?._id === user?._id || t.studentId === user?._id
      );
      setMyTickets(isolatedTickets);
    } catch (err) {
      console.error("Error loading student profile info:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchStudentProfileAndTickets();
  }, [user]);

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true); // Start Loading
    try {
      await API.post('/tickets', { title, description, category });
      setTicketMessage('🚀 Ticket raised successfully inside registry database!');
      setTitle('');
      setDescription('');
      await fetchStudentProfileAndTickets();
      setTimeout(() => setTicketMessage(''), 4000);
    } catch (err) {
      setTicketMessage('❌ Failed to dispatch ticket parameters.');
    } finally {
      setSubmitLoading(false); // Stop Loading
    }
  };

  // New Cancel Ticket Action Handler
  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm("क्या aap sach mein ye ticket cancel karna chahte hain?")) return;
    try {
      await API.patch(`/tickets/${ticketId}/cancel`);
      setTicketMessage('🗑️ Ticket cancelled successfully!');
      await fetchStudentProfileAndTickets();
      setTimeout(() => setTicketMessage(''), 4000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Ticket cancel karne mein problem aayi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Student Hub Portal</h1>
            <p className="text-indigo-100 text-sm mt-1">Manage your residency profile and hostel utility parameters</p>
          </div>
          <button onClick={logoutUser} className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg font-medium transition text-sm">
            Logout Session
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading personal profile metrics...</div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Profile Grid section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Personal Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-500">Full Name: <strong className="text-gray-800 ml-1">{user?.name}</strong></p>
                  <p className="text-gray-500">Email Address: <strong className="text-gray-800 ml-1">{user?.email}</strong></p>
                  <p className="text-gray-500">Contact Phone: <strong className="text-gray-800 ml-1">{profileData?.profile?.phone || 'N/A'}</strong></p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Room Assignment Metrics</h3>
                  {profileData?.room ? (
                    <div className="mt-2">
                      <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">
                        Allocated: Room {profileData.room.roomNumber}
                      </span>
                      <p className="text-xs text-gray-400 mt-3">Your desk occupancy registration is confirmed inside the structural registry database.</p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full">
                        Pending Allocation
                      </span>
                      <p className="text-xs text-gray-400 mt-3">Please check in with the administration desk workspace to assign an active bed layout space.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
              <h3 className="text-sm uppercase tracking-wider text-indigo-600 font-bold mb-4 border-b border-gray-100 pb-2">
                Raise a Complaint / Service Ticket
              </h3>
              
              {ticketMessage && (
                <div className={`p-3 rounded-lg mb-4 text-sm font-semibold border ${ticketMessage.includes('successfully') || ticketMessage.includes('cancelled') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {ticketMessage}
                </div>
              )}

              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Issue Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 text-gray-800" 
                      placeholder="e.g., Water leakage in bathroom" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 text-gray-800">
                      <option value="Electricity">Electricity</option>
                      <option value="Water">Water</option>
                      <option value="Wifi">Wifi</option>
                      <option value="Mess">Mess</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Detailed Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} required
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 text-gray-800 h-24 resize-none" 
                    placeholder="Describe your issue cleanly here..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitLoading}
                  className={`text-white font-bold px-6 py-2.5 rounded-lg text-sm transition shadow-sm transform active:scale-95 flex items-center gap-2 ${
                    submitLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {submitLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Complaint Ticket"
                  )}
                </button>
              </form>
            </div>

            {/* History Status Logs Tracker */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 font-bold mb-4 border-b border-gray-100 pb-2">
                Your Logged Tickets & History Status
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {myTickets.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">You haven't logged any structural utility grievance tickets yet.</p>
                ) : (
                  myTickets.map((t) => (
                    <div key={t._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 border border-gray-100 rounded-xl gap-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 tracking-wide uppercase block">{t.category}</span>
                        <h4 className="text-sm font-semibold text-gray-800 mt-0.5">{t.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                      </div>
                      <div className="w-full sm:w-auto flex items-center gap-3 justify-end">
                        {/* Dynamic Status Badges */}
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                          t.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          t.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {t.status === 'Pending' ? 'Pending Desk Review' : t.status === 'Cancelled' ? 'Cancelled' : 'Resolved ✔'}
                        </span>

                        {/* Conditional Action Button: Only show if Pending */}
                        {t.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelTicket(t._id)}
                            className="bg-white hover:bg-red-50 text-red-500 border border-red-200 text-xs font-semibold px-2.5 py-1 rounded-lg transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;