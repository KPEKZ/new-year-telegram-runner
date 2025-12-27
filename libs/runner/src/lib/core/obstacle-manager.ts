import { Box3, Object3D, Scene, Vector3 } from 'three';
import { ISpawnManager } from './interfaces/i-spawn-manager';
import { ModelLoader } from '../utils/model-loader';
import { SnowBall } from '../models/snowball';
import { Snowman } from '../models';

export class ObstacleManager implements ISpawnManager {
  private readonly _path = 'models'
  private readonly _snowball = new SnowBall();
  private readonly _snowman = new Snowman();

  private obstaclesModels: Object3D[] = [];
  private activeObstacles: Object3D[] = []; // все препятствия в сцене

  constructor(private scene: Scene) {}

  public async init() {
    const obstaclesKeys = ['snowgirl'];
    this.obstaclesModels = await Promise.all(
      obstaclesKeys.map((key) =>
        ModelLoader.loadModel(`${this._path}/${key}.glb`)
      )
    );
    this.obstaclesModels.push(this._snowball.model);
    this.obstaclesModels.push(this._snowman.model);
  }

  public spawn(position: Vector3): Object3D | null {

    if (this.obstaclesModels.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * this.obstaclesModels.length);
    const template = this.obstaclesModels[randomIndex];
    const obstacle = template.clone(true); // клонируем предзагруженную модель
    obstacle.position.copy(position);
    obstacle.rotation.y = Math.random() * Math.PI * 2; // случайный поворот

    const scale = 2 + Math.random() * 3; // от 1 до 3
    obstacle.scale.set(scale, scale, scale);

    this.scene.add(obstacle);
    this.activeObstacles.push(obstacle);

    return obstacle;
  }

  // Проверка коллизий с Сантой
  public checkCollisions(santa: Object3D, onCollect: () => void) {
    const santaBox = new Box3().setFromObject(santa);

    for (let i = this.activeObstacles.length - 1; i >= 0; i--) {
      const obstacle = this.activeObstacles[i];
      const obstacleBox = new Box3().setFromObject(obstacle);

      if (santaBox.intersectsBox(obstacleBox)) {
        this.scene.remove(obstacle);
        this.activeObstacles.splice(i, 1);
        onCollect();
      }
    }
  }

  // Очистка при необходимости
  public clearAll() {
    this.activeObstacles.forEach(obstacle => this.scene.remove(obstacle));
    this.activeObstacles = [];
  }

}
