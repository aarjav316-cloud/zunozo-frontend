import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrganizersList } from "../../api/adminApi";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { formatDate } from "../../utils/helpers";

const Organizers = () => {
  const navigate = useNavigate();
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      const response = await getOrganizersList();
      if (response.success && response.data) {
        setOrganizers(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load organizers");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizers = organizers.filter((org) =>
    (org.name || "").toLowerCase().includes((search || "").toLowerCase()) ||
    (org.email || "").toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090B]">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3"
              style={{ fontFamily: '"Geist", sans-serif', letterSpacing: "-0.03em" }}
            >
              Organizers
            </h1>
            <p className="text-zinc-500">
              Manage and view all platform organizers
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search organizers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[#18181B] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <h3 className="text-lg font-semibold text-rose-500 mb-2">Error Loading Data</h3>
            <p className="text-zinc-400">{error}</p>
          </div>
        ) : filteredOrganizers.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">No organizers found</h3>
            <p className="text-zinc-400">There are no organizers matching your search.</p>
          </div>
        ) : (
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-[#18181B] border-b border-zinc-800 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Organizer</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4">Total Events</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredOrganizers.map((org) => (
                    <tr key={org._id} className="hover:bg-zinc-900/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {org.avatar ? (
                            <img src={org.avatar} alt={org.name} className="w-10 h-10 rounded-full object-cover border border-zinc-800" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                              {org.name ? org.name.charAt(0).toUpperCase() : "O"}
                            </div>
                          )}
                          <span className="font-semibold text-white">{org.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{org.email}</td>
                      <td className="px-6 py-4 text-zinc-400">{formatDate(org.joinedDate)}</td>
                      <td className="px-6 py-4 text-white font-medium">{org.totalEvents}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          org.status === 'ACTIVE' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                            : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                        }`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/admin/organizers/${org._id}`)}
                          className="px-4 py-2 bg-zinc-800 text-white text-xs font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizers;
