import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',      // Default fallback role
    phone: '',            // Required data field for student schemas
    adminSecretCode: ''   // Required clearance key for admin validation
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Grab the query parameter from the URL (?role=...)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlRole = queryParams.get('role');
    if (urlRole === 'admin' || urlRole === 'student') {
      setFormData((prev) => ({ ...prev, role: urlRole }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Frontend validation structural sanity checks
    if (formData.role === 'student' && !formData.phone) {
      setError('Phone number is required for student registration.');
      setLoading(false);
      return;
    }

    if (formData.role === 'admin' && !formData.adminSecretCode) {
      setError('Admin Secret Passcode is required.');
      setLoading(false);
      return;
    }

    try {
      // Package payload data adaptively based on the user registration path
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'student' && { phone: formData.phone }),
        ...(formData.role === 'admin' && { adminSecretCode: formData.adminSecretCode })
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Smooth programmatic handoff directly to login portal upon successful write
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-3xl font-black text-white">Create Account</h2>
          <p className="text-sm text-slate-400">
            Registering as <span className={`font-bold uppercase ${formData.role === 'admin' ? 'text-purple-400' : 'text-emerald-400'}`}>{formData.role}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* 🎓 DYNAMIC ELEMENT: Renders conditionally to satisfy standard Student Schema dependencies */}
          {formData.role === 'student' && (
            <div className="space-y-2 transition-all duration-300 ease-in-out">
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">Contact Phone Number</label>
              <input
                type="tel"
                name="phone"
                required={formData.role === 'student'}
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          )}

          {/* 🛡️ DYNAMIC ELEMENT: Renders conditionally to secure Admin clearance gates */}
          {formData.role === 'admin' && (
            <div className="space-y-2 transition-all duration-300 ease-in-out">
              <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider">Admin Security Passcode</label>
              <input
                type="password"
                name="adminSecretCode"
                required={formData.role === 'admin'}
                value={formData.adminSecretCode}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-purple-900/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-700"
                placeholder="Enter validation clearance key"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 active:scale-98 disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing Registration...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-indigo-400 hover:underline font-semibold">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;