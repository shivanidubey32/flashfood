import mongoose from 'mongoose';

const globalSettingsSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: 'FlashFood',
    },
    supportEmail: {
      type: String,
      default: 'support@flashfood.com',
    },
    requireNgoVerification: {
      type: Boolean,
      default: true,
    },
    autoSuspendFraud: {
      type: Boolean,
      default: true,
    },
    dataRetentionPolicy: {
      type: String,
      default: 'Keep indefinitely (Default)',
    },
  },
  {
    timestamps: true,
  }
);

const GlobalSettings = mongoose.model('GlobalSettings', globalSettingsSchema);
export default GlobalSettings;
