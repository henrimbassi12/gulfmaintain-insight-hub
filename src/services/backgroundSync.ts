import { capacitorService } from './capacitorPlugins';
import { supabase } from '@/integrations/supabase/client';

interface SyncTask {
  id: string;
  type: 'maintenance' | 'equipment' | 'report' | 'prediction';
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

class BackgroundSyncService {
  private syncTasks: SyncTask[] = [];
  private isProcessing = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL = 30000; // 30 secondes
  private readonly MAX_RETRIES = 3;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Charger les tâches depuis le stockage local
    this.loadSyncTasks();
    
    // Démarrer le processus de synchronisation
    this.startSyncProcess();
    
    // Écouter les changements d'état de l'app
    if (capacitorService.isNativePlatform()) {
      capacitorService.addAppStateListener((state) => {
        if (state.isActive) {
          // Reprendre la synchronisation quand l'app devient active
          this.processSyncTasks();
        }
      });
    }
  }

  private loadSyncTasks() {
    try {
      const stored = localStorage.getItem('background_sync_tasks');
      if (stored) {
        this.syncTasks = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading sync tasks:', error);
      this.syncTasks = [];
    }
  }

  private saveSyncTasks() {
    try {
      localStorage.setItem('background_sync_tasks', JSON.stringify(this.syncTasks));
    } catch (error) {
      console.error('Error saving sync tasks:', error);
    }
  }

  private startSyncProcess() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.processSyncTasks();
    }, this.SYNC_INTERVAL);

    // Traitement initial
    this.processSyncTasks();
  }

  public addSyncTask(
    type: SyncTask['type'],
    data: any,
    maxRetries: number = this.MAX_RETRIES
  ): string {
    const task: SyncTask = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries
    };

    this.syncTasks.push(task);
    this.saveSyncTasks();
    
    // Traiter immédiatement si possible
    if (!this.isProcessing) {
      this.processSyncTasks();
    }

    return task.id;
  }

  private async processSyncTasks() {
    if (this.isProcessing || this.syncTasks.length === 0) {
      return;
    }

    // Vérifier la connectivité
    const networkStatus = await capacitorService.getNetworkStatus();
    if (networkStatus && !networkStatus.connected) {
      console.log('No network connection, skipping sync');
      return;
    }

    this.isProcessing = true;

    try {
      const tasksToProcess = [...this.syncTasks];
      
      for (const task of tasksToProcess) {
        try {
          const success = await this.syncTask(task);
          
          if (success) {
            // Supprimer la tâche réussie
            this.syncTasks = this.syncTasks.filter(t => t.id !== task.id);
            console.log(`Sync task ${task.id} completed successfully`);
          } else {
            // Incrémenter le compteur de retry
            const taskIndex = this.syncTasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
              this.syncTasks[taskIndex].retryCount++;
              
              // Supprimer si max retries atteint
              if (this.syncTasks[taskIndex].retryCount >= task.maxRetries) {
                this.syncTasks.splice(taskIndex, 1);
                console.error(`Sync task ${task.id} failed after ${task.maxRetries} retries`);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing sync task ${task.id}:`, error);
        }
      }

      this.saveSyncTasks();
    } catch (error) {
      console.error('Error processing sync tasks:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async syncTask(task: SyncTask): Promise<boolean> {
    try {
      switch (task.type) {
        case 'maintenance':
          return await this.syncMaintenance(task.data);
        case 'equipment':
          return await this.syncEquipment(task.data);
        case 'report':
          return await this.syncReport(task.data);
        case 'prediction':
          return await this.syncPrediction(task.data);
        default:
          console.warn(`Unknown sync task type: ${task.type}`);
          return false;
      }
    } catch (error) {
      console.error(`Error syncing task ${task.id}:`, error);
      return false;
    }
  }

  private async syncMaintenance(data: any): Promise<boolean> {
    try {
      if (data.id && data.id.startsWith('temp_')) {
        // Nouvelle maintenance
        const { error } = await supabase
          .from('maintenance_reports')
          .insert(data);
        return !error;
      } else {
        // Mise à jour maintenance
        const { error } = await supabase
          .from('maintenance_reports')
          .update(data)
          .eq('id', data.id);
        return !error;
      }
    } catch (error) {
      console.error('Error syncing maintenance:', error);
      return false;
    }
  }

  private async syncEquipment(data: any): Promise<boolean> {
    try {
      if (data.id && data.id.startsWith('temp_')) {
        // Nouvel équipement
        const { error } = await supabase
          .from('equipments')
          .insert(data);
        return !error;
      } else {
        // Mise à jour équipement
        const { error } = await supabase
          .from('equipments')
          .update(data)
          .eq('id', data.id);
        return !error;
      }
    } catch (error) {
      console.error('Error syncing equipment:', error);
      return false;
    }
  }

  private async syncReport(data: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('maintenance_reports')
        .insert(data);
      return !error;
    } catch (error) {
      console.error('Error syncing report:', error);
      return false;
    }
  }

  private async syncPrediction(data: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('failure_predictions')
        .insert(data);
      return !error;
    } catch (error) {
      console.error('Error syncing prediction:', error);
      return false;
    }
  }

  public getPendingTasksCount(): number {
    return this.syncTasks.length;
  }

  public getPendingTasksByType(): { [key: string]: number } {
    return this.syncTasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  public clearAllTasks() {
    this.syncTasks = [];
    this.saveSyncTasks();
  }

  public stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

// Instance singleton
export const backgroundSyncService = new BackgroundSyncService();
export default backgroundSyncService;