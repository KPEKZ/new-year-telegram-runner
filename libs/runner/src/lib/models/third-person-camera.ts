import * as THREE from 'three';

export class ThirdPersonCamera {
  private offset = new THREE.Vector3(0, 15, -15);
  private lookOffset = new THREE.Vector3(0, 8, 0);

  constructor(public camera: THREE.Camera, public target: THREE.Object3D) {}

  public update() {
    const idealPosition = this.target.position.clone().add(this.offset);
    this.camera.position.lerp(idealPosition, 0.1);

    const idealLook = this.target.position.clone().add(this.lookOffset);
    this.camera.lookAt(idealLook);
  }
}
