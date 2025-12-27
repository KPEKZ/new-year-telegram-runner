import * as THREE from 'three';

export class FootprintsEffect {
  private footprints: THREE.Mesh[] = []; // Массив для хранения следов (THREE.Mesh — это 3D-объект)

  private readonly _maxFootprints = 50;   // Максимум следов — чтобы не накапливались (экономия памяти)
  private readonly _thresholdTimeMs = 100;  // Пороговое время между спавном следа
  private readonly _spawnTimer = new THREE.Clock();
  private _lastLegIsLeft = false;

  constructor(private scene: THREE.Scene) {
    this._spawnTimer.start();
  }

  // Метод для спавна следа (вызывай из Santa.updateRun)
  public spawnFootprint(footPosition: THREE.Vector3, isLeftLeg: boolean) {
    if (this.footprints.length >= this._maxFootprints) { // Если слишком много — удаляем самый старый
      const oldFootprint = this.footprints.shift(); // Удаляем первый
      this.scene.remove(oldFootprint!); // Убираем из сцены
    }

    // Материал для следа (прозрачный, с текстурой)
    const material = new THREE.MeshBasicMaterial();

    // Создаём decal (наклейку)
    const footprintGeo = new THREE.BoxGeometry(1, 0.1, 1); // Простая геометрия для следа
    const footprintMesh = new THREE.Mesh(footprintGeo, material); // Объект следа

    // Лёгкий поворот для разнообразия (левая/правая нога)
    footprintMesh.position.set(footPosition.x, footPosition.y - 1, footPosition.z); // Позиция чуть выше дороги
    footprintMesh.rotation.y = Math.random() > 0.5 ? -0.2 : 0.2;

    const now = this._spawnTimer.getElapsedTime() * 1000;

    if (now < this._thresholdTimeMs || this._lastLegIsLeft === isLeftLeg || footPosition.y > 3) {
      return;
    }

    this.scene.add(footprintMesh); // Добавляем в сцену
    this.footprints.push(footprintMesh); // Сохраняем в массив
    this._lastLegIsLeft = isLeftLeg;

    this._spawnTimer.start();
  }

  public clearAll() {
    this.footprints.forEach(fp => this.scene.remove(fp)); // Очистка всех следов
    this.footprints = [];
  }
}
