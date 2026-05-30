import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const StudentDashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        // Direct, high-performance endpoint fetch
        const { data } = await API.get('/students/me');
        setProfile(data);
      } catch (err) {
        console.error("Error loading student profile info:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStudentProfile();
  }, [user]);

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
              
              {/* Personal Information Card */}
              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Personal Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-500">Full Name: <strong className="text-gray-800 ml-1">{user?.name}</strong></p>
                  <p className="text-gray-500">Email Address: <strong className="text-gray-800 ml-1">{user?.email}</strong></p>
                  <p className="text-gray-500">Contact Phone: <strong className="text-gray-800 ml-1">{profile?.phone || 'N/A'}</strong></p>
                </div>
              </div>

              {/* Room Assignment Status Card */}
              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Room Assignment Metrics</h3>
                  {profile?.roomId ? (
                    <div className="mt-2">
                      <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">
                        Allocated: Room {profile.roomId.roomNumber}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;