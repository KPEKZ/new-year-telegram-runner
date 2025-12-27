import * as THREE from 'three';
import { ModelLoader } from '../utils/model-loader';
import { ISpawnManager } from './interfaces/i-spawn-manager';

export class GiftManager implements ISpawnManager {
  private readonly _path = 'models';
  private giftModels: THREE.Object3D[] = [];
  private activeGifts: THREE.Object3D[] = []; // все подарки в сцене

  constructor(private scene: THREE.Scene) {}

  public async init() {
    const giftKeys = ['gift', 'gift_box_white', 'gift_with_tag'];
    this.giftModels = await Promise.all(giftKeys.map(key => ModelLoader.loadModel(`${this._path}/${key}.glb`)));
  }

  public spawn(position: THREE.Vector3): THREE.Object3D | null {
    if (this.giftModels.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * this.giftModels.length);
    const template = this.giftModels[randomIndex];
    const gift = template.clone(true); // клонируем предзагруженную модель

    gift.position.copy(position);
    gift.rotation.y = Math.random() * Math.PI * 2; // случайный поворот

    const scale = 1 + Math.random() * 2; // от 1 до 3
    gift.scale.set(scale, scale, scale);

    this.scene.add(gift);
    this.activeGifts.push(gift);

    return gift;
  }

  // Проверка коллизий с Сантой
  public checkCollisions(santa: THREE.Group, onCollect: () => void) {
    const santaBox = new THREE.Box3().setFromObject(santa);

    for (let i = this.activeGifts.length - 1; i >= 0; i--) {
      const gift = this.activeGifts[i];
      const giftBox = new THREE.Box3().setFromObject(gift);

      if (santaBox.intersectsBox(giftBox)) {
        this.scene.remove(gift);
        this.activeGifts.splice(i, 1);
        onCollect();
      }
    }
  }

  // Очистка при необходимости
  public clearAll() {
    this.activeGifts.forEach(gift => this.scene.remove(gift));
    this.activeGifts = [];
  }
}
