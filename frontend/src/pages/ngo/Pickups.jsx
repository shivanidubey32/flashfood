import { QrCode, CheckCircle, Package, Camera, Clock, X, Loader, ShieldCheck, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Pickups = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [upcomingPickups, setUpcomingPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, title: '' });

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!userInfo.token) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/donations/my-claims', config);
        setUpcomingPickups(data.filter(d => d.status === 'Claimed'));
      } catch (error) {
        console.error("Error fetching pickups", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPickups();
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('SUCCESS');
      showToast('QR Code Scanned Successfully!');
    }, 2000);
  };

  const handleMarkPickedUp = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + `/api/donations/${id}/complete`, {}, config);
      
      setUpcomingPickups(upcomingPickups.filter(p => p._id !== id));
      setConfirmModal({ show: false, id: null, title: '' });
      showToast('Item marked as picked up successfully!');
    } catch (error) {
      console.error(error);
      showToast('Failed to mark item as picked up', 'error');
    }
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pickup Management</h1>
          <p className="text-slate-500 mt-1">Manage scheduled pickups and verify donations with merchants.</p>
        </div>
        <button 
          onClick={() => setIsScanning(true)}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center shadow-lg shadow-slate-900/20"
        >
          <QrCode className="w-5 h-5 mr-2" />
          Scan Merchant QR
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduled Pickups List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Scheduled Pickups</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader className="w-8 h-8 text-green-500 animate-spin" />
                </div>
              ) : upcomingPickups.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-700">No upcoming pickups</p>
                  <p className="text-sm text-slate-500">Claim donations from the map to see them here.</p>
                </div>
              ) : (
                upcomingPickups.map((pickup) => (
                  <div key={pickup._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors gap-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mr-4 shrink-0">
                        <Package className="w-6 h-6 text-slate-700" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{pickup.merchant?.businessName || 'Unknown Merchant'}</p>
                        <p className="text-sm font-medium text-slate-700 mb-2">{pickup.quantityDescription} - {pickup.title}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> by {new Date(pickup.pickupTimeLimit).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                          <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md inline-flex items-center uppercase">
                            {pickup.status}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right w-full sm:w-auto">
                      <button 
                        onClick={() => setConfirmModal({ show: true, id: pickup._id, title: pickup.title })}
                        className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 mr-1" /> Picked Up
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Verification Status Card */}
        <div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Verification Status</h2>
            
            {!scanResult && !isScanning && (
              <div className="flex flex-col items-center justify-center text-center py-10 px-4 h-[300px] border-2 border-dashed border-slate-200 rounded-2xl">
                <QrCode className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="font-bold text-slate-700 mb-1">No Active Scan</h3>
                <p className="text-sm text-slate-500">Scan a merchant's QR code when picking up food to verify transfer.</p>
              </div>
            )}

            {scanResult === 'SUCCESS' && (
              <div className="flex flex-col items-center justify-center text-center py-10 px-4 h-[300px] bg-green-50 rounded-2xl border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-black text-green-700 text-xl mb-1">Pickup Verified!</h3>
                <p className="text-sm text-green-600 font-medium mb-4">Transfer recorded on blockchain.</p>
                <div className="bg-white w-full p-4 rounded-xl shadow-sm text-left">
                  <p className="text-xs text-slate-500 font-bold mb-1">MERCHANT</p>
                  <p className="text-sm font-bold text-slate-900 mb-3">Grand Hotel Banquet</p>
                  <p className="text-xs text-slate-500 font-bold mb-1">TRANSACTION ID</p>
                  <p className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">0x7F2B...4A9C</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mock QR Scanner Overlay */}
      {isScanning && (
        <div className="fixed inset-0 bg-slate-900/90 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
          <button 
            onClick={() => setIsScanning(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>
          
          <h2 className="text-white font-bold text-2xl mb-8">Scan QR Code</h2>
          
          <div className="relative w-72 h-72">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
            
            {/* Scanning Laser Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_15px_#22c55e] animate-[scan_2s_ease-in-out_infinite]"></div>
            
            <div className="w-full h-full bg-slate-800/50 flex items-center justify-center">
              <Camera className="w-12 h-12 text-slate-400 opacity-50" />
            </div>
          </div>
          <p className="text-slate-400 mt-8 text-sm">Point camera at merchant's screen</p>

          <style>{`
            @keyframes scan {
              0% { top: 0; }
              50% { top: 100%; }
              100% { top: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Confirm Deletion Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Mark as Picked Up</h3>
              <p className="text-slate-500 mb-8">Are you sure you want to mark "{confirmModal.title}" as picked up?</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setConfirmModal({ show: false, id: null, title: '' })}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleMarkPickedUp(confirmModal.id)}
                  className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
                >
                  Yes, Mark
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pickups;
