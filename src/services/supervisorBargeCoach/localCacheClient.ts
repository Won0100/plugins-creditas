//import { logger } from '../utils';

class LocalCacheClient {
  setTeamViewPath = (value: any) => this.set('teamViewPath', value);

  getTeamViewPath = () => this.get('teamViewPath');

  setAgentSyncDoc = (value: any) => this.set('agentSyncDoc', value);

  getAgentSyncDoc = () => this.get('agentSyncDoc');

  setPrivateToggle = (value: any) => this.set('privateToggle', value);

  getPrivateToggle = () => this.get('privateToggle');

  private set(key: string, value: any) {
    //logger.debug(`Storing ${key} with value ${value} to localStorage`);
    localStorage.setItem(key, value);
  }

  private get(key: string) {
    //logger.debug(`Getting ${key} from localStorage`);
    return localStorage.getItem(key);
  }
}

export default new LocalCacheClient();
