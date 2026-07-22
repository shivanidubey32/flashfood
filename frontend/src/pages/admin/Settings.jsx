import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Database, Shield, Loader } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    platformName: '',
    supportEmail: '',
    requireNgoVerification: true,
    autoSuspendFraud: true,
    dataRetentionPolicy: 'Keep indefinitely (Default)'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/admin/settings', config);
        setSettings(data);
      } catch (error) {
        console.error('Failed to load settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(((import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))) + '/api/admin/settings', settings, config);
      alert('Settings saved successfully');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader className="w-8 h-8 animate-spin text-amber-500" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-slate-500 mt-2">Manage global configurations, policies, and system parameters.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2 text-slate-400" /> General Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Platform Name</label>
              <input type="text" value={settings.platformName} onChange={e => setSettings({...settings, platformName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
              <input type="email" value={settings.supportEmail} onChange={e => setSettings({...settings, supportEmail: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-slate-400" /> Security & Access
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" checked={settings.requireNgoVerification} onChange={e => setSettings({...settings, requireNgoVerification: e.target.checked})} className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500 border-gray-300" />
              <div className="ml-4">
                <span className="block text-sm font-bold text-slate-900">Require NGO Document Verification</span>
                <span className="block text-xs text-slate-500 mt-1">NGOs cannot claim food until an admin verifies their 80G documents.</span>
              </div>
            </label>

            <label className="flex items-center p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" checked={settings.autoSuspendFraud} onChange={e => setSettings({...settings, autoSuspendFraud: e.target.checked})} className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500 border-gray-300" />
              <div className="ml-4">
                <span className="block text-sm font-bold text-slate-900">Auto-Suspend Fraudulent Accounts</span>
                <span className="block text-xs text-slate-500 mt-1">Automatically suspend users with 5+ cancelled orders in 24 hours.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Database className="w-5 h-5 mr-2 text-slate-400" /> Data Management
          </h2>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Data Retention Policy</label>
            <select value={settings.dataRetentionPolicy} onChange={e => setSettings({...settings, dataRetentionPolicy: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none">
              <option>Keep indefinitely (Default)</option>
              <option>Delete logs after 1 year</option>
              <option>Delete logs after 90 days</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button disabled={saving} type="submit" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center disabled:opacity-70">
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
