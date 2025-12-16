import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [inputNames, setInputNames] = useState('');
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const backendURL = 'http://localhost:5000';

    const fetchLeads = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/leads`);
            setLeads(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch leads');
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleSubmit = async () => {
        if (!inputNames.trim()) return;

        setLoading(true);
        setError(null);

        const names = inputNames.split(/[\n,]+/).map(n => n.trim()).filter(n => n);
        if (names.length === 0) {
            setLoading(false);
            return;
        }
        try {
            await axios.post(`${backendURL}/api/leads`, { names });
            setInputNames('');
            await fetchLeads(); // Refresh list
        } catch (err) {
            setError('Failed to process batch');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter(lead => {
        if (filter === 'All') return true;
        return lead.status === filter;
    });

    return (
        <div className="min-h-screen bg-background text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header className="text-center space-y-2">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Smart Lead
                    </h1>
                    <p className="text-gray-400 text-lg">Automated Lead Enrichment & Verification</p>
                </header>

                {/* Input Section */}
                <section className="bg-surface rounded-2xl p-6 shadow-2xl border border-gray-800 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        Add New Leads
                    </h2>
                    <div className="space-y-4">
                        <textarea
                            className="w-full h-32 bg-background border border-gray-700 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                            placeholder="Enter names separated by commas or new lines (e.g. Peter, Aditi, Ravi)..."
                            value={inputNames}
                            onChange={(e) => setInputNames(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Enrich Leads'}
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    </div>
                </section>

                {/* Results Section */}
                <section className="bg-surface rounded-2xl p-6 shadow-2xl border border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <span className="w-2 h-8 bg-secondary rounded-full"></span>
                            Enriched Results
                        </h2>

                        {/* Filter Toggle */}
                        <div className="flex bg-background rounded-lg p-1 border border-gray-700">
                            {['All', 'Verified', 'To Check'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setFilter(mode)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === mode
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-800/50 text-gray-400 uppercase text-xs tracking-wider">
                                    <th className="p-4 rounded-tl-xl">Name</th>
                                    <th className="p-4">Predicted Country</th>
                                    <th className="p-4">Confidence</th>
                                    <th className="p-4 rounded-tr-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500 italic">
                                            No leads found. Start by adding some names above.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <tr key={lead._id} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4 font-semibold text-white">{lead.name}</td>
                                            <td className="p-4 flex items-center gap-2">
                                                {lead.country !== 'Unknown' && lead.country !== 'Error' ? (
                                                    <>
                                                        <img
                                                            src={`https://flagcdn.com/w20/${lead.country.toLowerCase()}.png`}
                                                            alt={lead.country}
                                                            className="w-5 rounded-sm"
                                                        />
                                                        {lead.country}
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500">?</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${lead.probability > 0.6 ? 'bg-secondary' : 'bg-yellow-500'}`}
                                                            style={{ width: `${(lead.probability * 100).toFixed(0)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{(lead.probability * 100).toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${lead.status === 'Verified'
                                                        ? 'bg-secondary/10 text-secondary border border-secondary/20'
                                                        : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                    }`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Dashboard;
