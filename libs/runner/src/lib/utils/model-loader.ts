import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Object3D } from 'three';

export class ModelLoader {
  private static loader = new GLTFLoader();
  private static cache = new Map<string, Object3D>();

  public static async loadModel(path: string): Promise<Object3D> {
    const cachedModel = this.cache.get(path);

    if (cachedModel) {
      return cachedModel.clone();
    }

    const gltf: GLTF = await this.loader.loadAsync(path);
    const model = gltf.scene;

    this.cache.set(path, model);

    return model.clone();
  }

  public static clone(model: Object3D): Object3D {
    return model.clone(true);
  }
}
