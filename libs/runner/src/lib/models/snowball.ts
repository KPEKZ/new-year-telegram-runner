import * as THREE from 'three';

export class SnowBall {
  public model: THREE.Mesh;

  constructor() {
    this.model = this.createBall();
  }

  private createBall(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(1, 5, 5);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

    return new THREE.Mesh(geometry, material);
  }
}
