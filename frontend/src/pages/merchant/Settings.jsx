import { useState, useEffect } from 'react';
import { Settings2, Bell, Shield, Wallet, Loader } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    orderAlerts: true,
    donationAlerts: true,
    marketingEmails: false,
    autoAcceptOrders: false,
    payoutMethod: 'Bank Transfer'
  });
  
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        setToken(userInfo.token);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', config);
        
        // Merge from database
        setSettings({
          orderAlerts: data.notificationPreferences?.orderAlerts ?? true,
          donationAlerts: data.notificationPreferences?.donationAlerts ?? true,
          marketingEmails: data.notificationPreferences?.promotions ?? false,
          autoAcceptOrders: data.merchantPreferences?.autoAcceptOrders ?? false,
          payoutMethod: data.merchantPreferences?.payoutMethod ?? 'Bank Transfer'
        });
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async (newSettings) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/auth/profile', {
        notificationPreferences: {
          orderAlerts: newSettings.orderAlerts,
          donationAlerts: newSettings.donationAlerts,
          promotions: newSettings.marketingEmails
        },
        merchantPreferences: {
          autoAcceptOrders: newSettings.autoAcceptOrders,
          payoutMethod: newSettings.payoutMethod
        }
      }, config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    handleSaveSettings(newSettings);
  };
  
  const handleSelectChange = (e) => {
    const newSettings = { ...settings, payoutMethod: e.target.value };
    setSettings(newSettings);
    handleSaveSettings(newSettings);
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader className="w-8 h-8 animate-spin text-orange-500" /></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Store Settings</h1>
          <p className="text-slate-600 mt-1">Manage your store preferences and operations.</p>
        </div>
        {saved && <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">Saved automatically</span>}
      </div>

      <div className="space-y-6">
        {/* Notifications Group */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Notification Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-bold text-slate-900">New Order Alerts</p>
                <p className="text-sm text-slate-500">Get notified immediately when a new order is placed.</p>
              </div>
              <input type="checkbox" checked={settings.orderAlerts} onChange={() => toggleSetting('orderAlerts')} className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 accent-orange-500" />
            </label>
            <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-bold text-slate-900">Donation Claims</p>
                <p className="text-sm text-slate-500">Alert me when an NGO claims my food donation.</p>
              </div>
              <input type="checkbox" checked={settings.donationAlerts} onChange={() => toggleSetting('donationAlerts')} className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 accent-orange-500" />
            </label>
          </div>
        </div>

        {/* Operations Group */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Settings2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Operational Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-bold text-slate-900">Auto-Accept Orders</p>
                <p className="text-sm text-slate-500">Automatically accept all incoming orders without manual review.</p>
              </div>
              <input type="checkbox" checked={settings.autoAcceptOrders} onChange={() => toggleSetting('autoAcceptOrders')} className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500 accent-blue-500" />
            </label>
          </div>
        </div>

        {/* Payments Group */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Payout Details</h3>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Payout Method</label>
            <select 
              value={settings.payoutMethod}
              onChange={handleSelectChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
              <option value="UPI">UPI</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
