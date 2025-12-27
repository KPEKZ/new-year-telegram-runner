import { ISceneManager } from './interfaces/i-scene-manager';
import { BaseScene } from './base-scene';

export class SceneManager implements ISceneManager {
  private readonly _scenes = new Map<string, BaseScene>();
  private _activeScene : BaseScene | undefined;

  public addScene(name: string, scene: BaseScene): void {
    this._scenes.set(name, scene);
  }

  public removeScene(name: string): void {
    this._scenes.delete(name);
  }

  public getScene(name: string): BaseScene | undefined {
    return this._scenes.get(name);
  }

  public getActiveScene(): BaseScene | undefined {
    return this._activeScene;
  }

  public switchToScene(name: string): void {
    const scene = this._scenes.get(name);
    if (!scene) return;
    this._activeScene = scene;
  }
}
