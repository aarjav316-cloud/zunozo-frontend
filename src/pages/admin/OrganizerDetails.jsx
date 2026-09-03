import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrganizerDetails } from "../../api/adminApi";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { formatDate } from "../../utils/helpers";

const OrganizerDetails = () => {
  const { organizerId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ organizer: null, events: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, [organizerId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrganizerDetails(organizerId);
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load organizer details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PENDING_REVIEW":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "CHANGES_REQUESTED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "CANCELLED":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      case "COMPLETED":
        return "bg-teal-500/10 text-teal-500 border-teal-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="h-40 bg-zinc-900 animate-pulse rounded-2xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-zinc-900 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data.organizer) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <AdminNavbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{error || "Organizer not found"}</h2>
            <button onClick={() => navigate("/admin/organizers")} className="px-6 py-2.5 bg-white text-black rounded-lg font-medium mt-4">
              Back to Organizers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { organizer, events } = data;

  return (
    <div className="min-h-screen bg-[#09090B]">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate("/admin/organizers")}
          className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-6 text-sm"
        >
          &larr; Back to Organizers
        </button>

        {/* Organizer Header Profile */}
        <div className="bg-[#18181B] border border-zinc-800 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-start md:items-center gap-8 shadow-lg">
          {organizer.avatar ? (
            <img src={organizer.avatar} alt={organizer.name} className="w-32 h-32 rounded-full object-cover border-4 border-zinc-800 shadow-xl" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-[#000000] flex items-center justify-center text-white font-bold text-4xl shadow-xl border-4 border-zinc-800">
              {organizer.name ? organizer.name.charAt(0).toUpperCase() : "O"}
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: '"Geist", sans-serif' }}>
                {organizer.name}
              </h1>
              <p className="text-zinc-400">{organizer.email}</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-zinc-800">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Joined Date</p>
                <p className="text-sm text-white font-medium">{formatDate(organizer.joinedDate)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Company</p>
                <p className="text-sm text-white font-medium">{organizer.company || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
                <p className="text-sm text-white font-medium">{organizer.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Total Events</p>
                <p className="text-sm text-white font-medium">{events.length}</p>
              </div>
            </div>
            
            {organizer.bio && (
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Bio</p>
                <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed">{organizer.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Organizer's Events */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Geist", sans-serif' }}>Created Events</h2>
        </div>

        {events.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">No events</h3>
            <p className="text-zinc-400">This organizer has not created any events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-[#18181B] border border-zinc-800 rounded-[20px] overflow-hidden hover:border-zinc-700 transition-all group">
                <div className="relative h-48 bg-zinc-900 overflow-hidden">
                  {event.coverImage ? (
                    <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500" />
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-xl ${getStatusColor(event.status)}`}>
                      {event.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold border border-white/10 backdrop-blur-xl bg-black/40 text-white uppercase">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-1">{event.title}</h3>
                  <div className="space-y-2 text-sm text-zinc-400 mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/events/${event.slug || event._id}`)}
                    className="w-full py-2.5 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                  >
                    View Event Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDetails;
