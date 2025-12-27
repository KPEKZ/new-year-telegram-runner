import * as THREE from 'three';

export abstract class BaseScene {
  protected readonly _scene = new THREE.Scene();
  protected readonly _axisHelder = new THREE.AxesHelper(5);

  constructor(
    protected readonly _canvas: HTMLCanvasElement,
    protected readonly _camera: THREE.Camera,
    protected readonly _renderer: THREE.WebGLRenderer,
  ) {}

  public get scene(): THREE.Scene {
    return this._scene;
  }

  public get camera(): THREE.Camera {
    return this._camera;
  }

  public get renderer(): THREE.WebGLRenderer {
    return this._renderer;
  }

  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  public get axisHelder(): THREE.AxesHelper {
    return this._axisHelder;
  }

  public abstract init(): void | Promise<void>;
  public abstract update(delta: number): void;
  public abstract resize(): void;
  public abstract restart(): void | Promise<void>;
}
