import { BaseScene } from '../base-scene';

export interface ISceneManager {
  addScene(name: string, scene: BaseScene): void;
  removeScene(name: string): void;
  getScene(name: string): BaseScene | undefined;
  getActiveScene(): BaseScene | undefined;
  switchToScene(name: string): void;
}
