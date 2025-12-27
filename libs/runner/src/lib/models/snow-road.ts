import * as THREE from 'three';
import { ModelLoader } from '../utils/model-loader';
import { GiftManager } from '../core/gift-manager';
import { ObstacleManager } from '../core/obstacle-manager';

interface RoadSegment {
  segment: THREE.Mesh;
  leftSnow: THREE.Mesh;
  rightSnow: THREE.Mesh;
  trees: THREE.Object3D[];
}

export class SnowRoad {
  private readonly _path = 'models';
  private _treeModel: THREE.Object3D | null = null;

  public segments: RoadSegment[] = [];
  private segmentLength = 100;
  private numSegments = 5;
  private roadWidth = 50;
  private roadHeight = 0.5;
  private treeSpacingMin = 15;
  private treeSpacingMax = 35;
  private snowWidth = 200;

  constructor(
    private scene: THREE.Scene,
    private giftManager: GiftManager,
    private obstacleManager: ObstacleManager)
  {}

  public async init() {
    this._treeModel = await ModelLoader.loadModel(`${this._path}/trees.glb`);
    await this.createInitialRoad();
  }

  private async createInitialRoad() {
    const roadGeo = new THREE.BoxGeometry(this.roadWidth, this.roadHeight, this.segmentLength);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const snowMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const snowGeo = new THREE.BoxGeometry(this.snowWidth, 0.5, this.segmentLength);

    for (let i = 0; i < this.numSegments; i++) {
      const z = this.segmentLength / 2 + i * this.segmentLength;

      const segment = new THREE.Mesh(roadGeo, roadMat);
      segment.position.set(0, 0, z);
      this.scene.add(segment);

      const leftSnow = new THREE.Mesh(snowGeo, snowMat);
      leftSnow.position.set(this.roadWidth / 2 + this.snowWidth / 2, 0, z);
      this.scene.add(leftSnow);

      const rightSnow = new THREE.Mesh(snowGeo, snowMat);
      rightSnow.position.set(-this.roadWidth / 2 - this.snowWidth / 2, 0, z);
      this.scene.add(rightSnow);

      const trees = this.spawnTreesForSide(leftSnow.position.x, z);
      trees.push(...this.spawnTreesForSide(rightSnow.position.x, z));

      this.segments.push({ segment, leftSnow, rightSnow, trees });

      this.spawnGiftsOnSegment(z);
      this.spawnObstaclesOnSegment(z);
    }
  }

  private spawnGiftsOnSegment(segmentZ: number) {
    const numGifts = 2 + Math.floor(Math.random() * 3); // 2-4 подарка на сегмент

    for (let i = 0; i < numGifts; i++) {
      const x = (Math.random() - 0.5) * this.roadWidth * 0.9; // от -ширины до +ширины, с отступом от краёв
      const z = segmentZ + Math.random() * this.segmentLength;

      this.giftManager?.spawn(new THREE.Vector3(x, 3, z));
    }
  }

  private spawnObstaclesOnSegment(segmentZ: number) {
    const numObstacles = 1 + Math.floor(Math.random() * 3); // 2-4 препятствий на сегмент

    for (let i = 0; i < numObstacles; i++) {
      const x = (Math.random() - 0.5) * this.roadWidth * 0.9; // от -ширины до +ширины, с отступом от краёв
      const z = segmentZ + Math.random() * this.segmentLength;

      this.obstacleManager?.spawn(new THREE.Vector3(x, 3, z));
    }
  }

  private spawnTreesForSide(baseX: number, segmentZ: number): THREE.Object3D[] {
    if (!this._treeModel) return [];

    const trees: THREE.Object3D[] = [];
    const numTrees = Math.floor(this.snowWidth / ((this.treeSpacingMin + this.treeSpacingMax) / 5));

    for (let i = 0; i < numTrees; i++) {
      // Случайное смещение по X и Z внутри снежной зоны
      const offsetX = (Math.random() - 0.5) * this.snowWidth;
      const offsetZ = (Math.random() - 0.5) * this.segmentLength;

      const tree = this._treeModel.children[Math.floor(Math.random() * this._treeModel.children.length)].clone(true);
      tree.position.set(baseX + offsetX, 0, segmentZ + offsetZ);

      const scale = 1 + Math.random() * 2.5;
      tree.scale.set(scale, scale, scale);
      tree.rotation.y = Math.random() * Math.PI * 2;

      this.scene.add(tree);
      trees.push(tree);
    }

    return trees;
  }

  public update(santa: THREE.Group) {
    const santaZ = santa.position.z;

    if (this.segments.length === 0) return;

    // Проверяем, прошёл ли Санта первый сегмент
    const threshold = this.segments[0].segment.position.z + this.segmentLength;

    if (santaZ > threshold) {
      // Перемещаем первый сегмент в конец
      const segment = this.segments.shift()!;
      const deltaZ = this.segmentLength * this.numSegments;

      segment.segment.position.z += deltaZ;
      segment.leftSnow.position.z += deltaZ;
      segment.rightSnow.position.z += deltaZ;

      segment.trees.forEach(tree => tree.position.z += deltaZ);

      // Спавним новые подарки на перемещённом сегменте
      this.spawnGiftsOnSegment(segment.segment.position.z);

      // Спавним новые препятствия на перемещённом сегменте
      this.spawnObstaclesOnSegment(segment.segment.position.z);

      this.segments.push(segment);
    }
  }

  public async reset() {
    await this.createInitialRoad();
  }

  public clearAll(): void {
    this.segments.forEach(segment => {
      this.scene.remove(segment.segment);
      this.scene.remove(segment.leftSnow);
      this.scene.remove(segment.rightSnow);

      segment.trees.forEach(tree => this.scene.remove(tree));
    })
    this.segments = [];
  }
}
