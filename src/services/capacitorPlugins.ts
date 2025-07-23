import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App, AppState } from '@capacitor/app';
import { Network, NetworkStatus } from '@capacitor/network';
import { Device, DeviceInfo } from '@capacitor/device';
import { toast } from 'sonner';

class CapacitorPluginService {
  private isNative: boolean;
  private networkStatus: NetworkStatus | null = null;
  private appStateListeners: ((state: AppState) => void)[] = [];

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.initialize();
  }

  private async initialize() {
    if (!this.isNative) return;

    try {
      // Configuration de la barre de statut
      await this.configureStatusBar();
      
      // Masquer le splash screen
      await this.hideSplashScreen();
      
      // Initialiser les listeners
      this.setupNetworkListeners();
      this.setupAppStateListeners();
      this.setupBackButtonHandler();
      
      console.log('Capacitor plugins initialized successfully');
    } catch (error) {
      console.error('Error initializing Capacitor plugins:', error);
    }
  }

  // Configuration de la barre de statut
  private async configureStatusBar() {
    try {
      await StatusBar.setStyle({ style: Style.Default });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      await StatusBar.show();
    } catch (error) {
      console.error('Error configuring status bar:', error);
    }
  }

  // Masquer le splash screen
  private async hideSplashScreen() {
    try {
      await SplashScreen.hide();
    } catch (error) {
      console.error('Error hiding splash screen:', error);
    }
  }

  // Gestion du réseau
  private setupNetworkListeners() {
    Network.addListener('networkStatusChange', (status) => {
      this.networkStatus = status;
      
      if (status.connected) {
        toast.success('Connexion rétablie');
      } else {
        toast.warning('Connexion perdue - Mode hors ligne');
      }
    });

    // Obtenir le statut initial
    Network.getStatus().then((status) => {
      this.networkStatus = status;
    });
  }

  // Gestion des états de l'application
  private setupAppStateListeners() {
    App.addListener('appStateChange', (state) => {
      console.log('App state changed:', state);
      
      // Notifier tous les listeners
      this.appStateListeners.forEach(listener => listener(state));
      
      if (state.isActive) {
        // L'app devient active
        console.log('App is now active');
      } else {
        // L'app passe en arrière-plan
        console.log('App went to background');
      }
    });
  }

  // Gestion du bouton retour Android
  private setupBackButtonHandler() {
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        // Laisser la navigation normale se faire
        return;
      } else {
        // Confirmer avant de quitter l'app
        this.confirmAppExit();
      }
    });
  }

  private confirmAppExit() {
    const confirmed = window.confirm('Voulez-vous vraiment quitter l\'application ?');
    if (confirmed) {
      App.exitApp();
    }
  }

  // API publique
  public async getDeviceInfo(): Promise<DeviceInfo | null> {
    if (!this.isNative) return null;
    
    try {
      return await Device.getInfo();
    } catch (error) {
      console.error('Error getting device info:', error);
      return null;
    }
  }

  public async getNetworkStatus(): Promise<NetworkStatus | null> {
    if (!this.isNative) return null;
    
    try {
      return await Network.getStatus();
    } catch (error) {
      console.error('Error getting network status:', error);
      return null;
    }
  }

  public getCurrentNetworkStatus(): NetworkStatus | null {
    return this.networkStatus;
  }

  public addAppStateListener(listener: (state: AppState) => void) {
    this.appStateListeners.push(listener);
    
    // Retourner une fonction pour supprimer le listener
    return () => {
      const index = this.appStateListeners.indexOf(listener);
      if (index > -1) {
        this.appStateListeners.splice(index, 1);
      }
    };
  }

  public async setStatusBarStyle(style: Style) {
    if (!this.isNative) return;
    
    try {
      await StatusBar.setStyle({ style });
    } catch (error) {
      console.error('Error setting status bar style:', error);
    }
  }

  public async setStatusBarColor(color: string) {
    if (!this.isNative) return;
    
    try {
      await StatusBar.setBackgroundColor({ color });
    } catch (error) {
      console.error('Error setting status bar color:', error);
    }
  }

  public isNativePlatform(): boolean {
    return this.isNative;
  }

  public getPlatform(): string {
    return Capacitor.getPlatform();
  }
}

// Instance singleton
export const capacitorService = new CapacitorPluginService();
export default capacitorService;