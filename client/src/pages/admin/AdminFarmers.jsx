import { useEffect, useState, useCallback } from "react";
import { Search, User, Phone, MapPin, Eye, X } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { formatDate } from "../../utils/units";

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [farmerDetails, setFarmerDetails] = useState(null);

  const loadFarmers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/admin/farmers?search=${encodeURIComponent(search)}`);
      setFarmers(res.data.farmers || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFarmers();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadFarmers]);

  const viewDetails = async (farmer) => {
    setSelectedFarmer(farmer);
    setDetailsLoading(true);
    try {
      const res = await api.get(`/admin/farmers/${farmer._id}`);
      setFarmerDetails(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading && farmers.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registered Farmers Directory</h1>
          <p className="text-sm text-gray-500">Manage farmer accounts, profiles, and their cultivated plots</p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, mobile, ID, or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm shadow-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadFarmers} />}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto table-responsive">
          <table className="min-w-[700px] w-full text-left text-sm text-gray-600">
            <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Farmer ID</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Name</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Mobile</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Village & District</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">Registered On</th>
                <th className="px-4 py-3.5 sm:px-6 sm:py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {farmers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-gray-400">
                    No farmers found matching your search.
                  </td>
                </tr>
              ) : (
                farmers.map((f) => (
                  <tr key={f._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-mono font-semibold text-brand-800 whitespace-nowrap">
                      {f.farmerId || "—"}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-semibold text-gray-900 whitespace-nowrap">{f.name}</td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">{f.mobile}</td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                      {f.village}, {f.district}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 capitalize">
                        {f.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-xs text-gray-400 whitespace-nowrap">{formatDate(f.createdAt)}</td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => viewDetails(f)}
                        className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Farmer Details Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3.5 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="font-mono text-xs text-brand-700 font-bold">{selectedFarmer.farmerId}</span>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{selectedFarmer.name}</h2>
              </div>
              <button onClick={() => setSelectedFarmer(null)} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailsLoading ? (
              <div className="py-12"><Loader /></div>
            ) : farmerDetails ? (
              <div className="mt-4 space-y-6 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 rounded-2xl bg-gray-50 p-4">
                  <div>
                    <span className="text-xs text-gray-400">Mobile:</span>
                    <p className="font-semibold text-gray-800">{selectedFarmer.mobile}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Email:</span>
                    <p className="font-semibold text-gray-800">{selectedFarmer.email || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Location:</span>
                    <p className="font-semibold text-gray-800">{selectedFarmer.village}, {selectedFarmer.district}, {selectedFarmer.state}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Language:</span>
                    <p className="font-semibold text-gray-800 uppercase">{selectedFarmer.preferredLanguage}</p>
                  </div>
                </div>

                {/* Farmer Registered Fields */}
                <div>
                  <h3 className="font-bold text-gray-900">Registered Fields ({farmerDetails.fields?.length || 0})</h3>
                  <div className="mt-2 space-y-2">
                    {farmerDetails.fields?.length === 0 ? (
                      <p className="text-xs text-gray-400">No fields registered.</p>
                    ) : (
                      farmerDetails.fields.map((fld) => (
                        <div key={fld._id} className="flex items-center justify-between rounded-xl border p-3">
                          <div>
                            <p className="font-semibold text-gray-800">{fld.name}</p>
                            <p className="text-xs text-gray-500">
                              {fld.area} {fld.areaUnit} &bull; {fld.variety || "Standard"} &bull; {fld.cropType}
                            </p>
                          </div>
                          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800">
                            {fld.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Tickets & Deliveries summary */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="rounded-xl border p-4 text-center">
                    <p className="text-xs text-gray-500">Supply Tickets</p>
                    <p className="text-xl font-bold text-brand-700">{farmerDetails.tickets?.length || 0}</p>
                  </div>
                  <div className="rounded-xl border p-4 text-center">
                    <p className="text-xs text-gray-500">Recorded Deliveries</p>
                    <p className="text-xl font-bold text-blue-700">{farmerDetails.deliveries?.length || 0}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
