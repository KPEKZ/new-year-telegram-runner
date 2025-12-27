import { MainScene } from "../scenes";
import { BaseScene } from "./base-scene";
import { ISceneManager } from "./interfaces/i-scene-manager";
import { SceneManager } from "./scene-manager";
import * as THREE from 'three';

export class GameEngine {
  private _sceneManager: ISceneManager = new SceneManager();
  private _lastTime = performance.now();

  public get currentScene() {
    return this._sceneManager.getActiveScene();
  }

  constructor(canvas: HTMLCanvasElement) {
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const mainScene = new MainScene(canvas, camera, renderer);

    this.addScene('main', mainScene);
  }

  public addScene(name: string, scene: BaseScene): void {
    this._sceneManager.addScene(name, scene);
  }

  public startScene(name: string): void {
    const scene = this._sceneManager.getScene(name);
    if (!scene) return;

    scene.init();
    this._sceneManager.switchToScene(name);
    this.loop();
  }

  public resize(): void {
    const scene = this._sceneManager.getActiveScene();
    scene?.resize();
  }

  private loop = () => {
    const now = performance.now();
    const delta = (now - this._lastTime) / 1000;
    this._lastTime = now;

    this._sceneManager.getActiveScene()?.update(delta);
    requestAnimationFrame(this.loop);
  }
}
