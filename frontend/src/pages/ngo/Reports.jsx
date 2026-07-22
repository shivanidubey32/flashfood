import { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Reports = () => {
  const [reports, setReports] = useState(() => {
    return JSON.parse(localStorage.getItem('ngo_reports')) || [
      { id: 1, name: 'Monthly Impact Report - Dec 2023', type: 'Impact', size: '2.4 MB', date: '2024-01-01' },
      { id: 2, name: 'Donation Ledger Q4 2023', type: 'Financial', size: '1.1 MB', date: '2024-01-05' },
      { id: 3, name: 'Volunteer Hours Summary', type: 'Operations', size: '0.8 MB', date: '2024-01-10' }
    ];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'Impact' });

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    localStorage.setItem('ngo_reports', JSON.stringify(reports));
  }, [reports]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    const newReport = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      size: '0.5 MB',
      date: new Date().toISOString().split('T')[0]
    };
    
    setReports([newReport, ...reports]);
    setIsModalOpen(false);
    setFormData({ name: '', type: 'Impact' });
    showToast('Report generated successfully!');
  };

  const handleDownload = (name) => {
    showToast(`Downloading ${name}...`);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {toast.type === 'error' ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reports & Documents</h1>
          <p className="text-slate-500 mt-1">Generate and download compliance and impact reports.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center shadow-lg shadow-blue-600/20"
        >
          <FileText className="w-5 h-5 mr-2" />
          Generate New Report
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg focus:ring-slate-500 focus:border-slate-500 block p-2 outline-none">
              <option>All Types</option>
              <option>Impact</option>
              <option>Financial</option>
              <option>Operations</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg focus:ring-slate-500 focus:border-slate-500 block p-2 outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {reports.map((report) => (
            <div key={report.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{report.name}</h3>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{report.type}</span>
                    <span className="text-slate-400">{report.size}</span>
                    <span className="text-slate-400">{report.date}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(report.name)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-6">Generate Report</h2>
              
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Report Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Q1 Impact Summary"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Report Type</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Impact</option>
                    <option>Financial</option>
                    <option>Operations</option>
                    <option>Compliance</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 mt-4 shadow-lg shadow-blue-500/30">
                  Generate
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Reports;
