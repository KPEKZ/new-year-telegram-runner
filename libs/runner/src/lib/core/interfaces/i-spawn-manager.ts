import { Object3D, Vector3 } from "three";

export interface ISpawnManager {
  init(): Promise<void> | void;
  spawn(position: Vector3): void;
  checkCollisions(player: Object3D, callback : () => Promise<void> | void): void;
}
