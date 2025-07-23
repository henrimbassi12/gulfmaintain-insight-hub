import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e0c7f4701b7d41c4ab431ae19dda48f8',
  appName: 'gulfmaintain-insight-hub',
  webDir: 'dist',
  server: {
    url: 'https://e0c7f470-1b7d-41c4-ab43-1ae19dda48f8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;