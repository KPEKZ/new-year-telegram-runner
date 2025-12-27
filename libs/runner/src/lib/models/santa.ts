import * as THREE from 'three';

export class Santa {
  public model: THREE.Group = this.createSanta();

  private createSanta(): THREE.Group {
    const santa = new THREE.Group();

    // ====== МАТЕРИАЛЫ ======
    const red = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const white = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const skin = new THREE.MeshStandardMaterial({ color: 0xffe0bd });
    const black = new THREE.MeshStandardMaterial({ color: 0x000000 });

    // ====== ТЕЛО ======
    const bodyGeo = new THREE.BoxGeometry(1.2, 1.5, 0.8);
    const body = new THREE.Mesh(bodyGeo, red);
    body.position.y = 0;
    santa.add(body);

    // ====== ГОЛОВА ======
    const headGeo = new THREE.BoxGeometry(1, 1, 1);
    const head = new THREE.Mesh(headGeo, skin);
    head.position.y = 1.4;
    santa.add(head);

    // ====== ГЛАЗА =======
    const leftEye = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const rightEye = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const leftEyeMesh = new THREE.Mesh(leftEye, black);
    const rightEyeMesh = new THREE.Mesh(rightEye, black);
    leftEyeMesh.position.set(-0.3, 1.6, 0.5);
    rightEyeMesh.position.set(0.3, 1.6, 0.5);
    santa.add(leftEyeMesh, rightEyeMesh);

    // ====== БОРОДА ======
    const beardGeo = new THREE.BoxGeometry(1, 0.5, 1.05);
    const beard = new THREE.Mesh(beardGeo, white);
    beard.position.set(0, 1, 0.05);
    santa.add(beard);

    // ====== ШАПКА ======
    const hatBaseGeo = new THREE.BoxGeometry(1.1, 0.4, 1.1);
    const hatBase = new THREE.Mesh(hatBaseGeo, red);
    hatBase.position.y = 2;
    santa.add(hatBase);

    const hatTopGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const hatTop = new THREE.Mesh(hatTopGeo, red);
    hatTop.position.set(0.2, 2.4, 0);
    santa.add(hatTop);

    const hatPomGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const hatPom = new THREE.Mesh(hatPomGeo, white);
    hatPom.position.set(0.5, 2.7, 0);
    santa.add(hatPom);

    // ====== РУКИ ======
    const armGeo = new THREE.BoxGeometry(0.4, 1.2, 0.4);
    const leftArm = new THREE.Mesh(armGeo, red);
    const rightArm = new THREE.Mesh(armGeo, red);
    rightArm.position.set(-0.9, 0, 0);
    leftArm.position.set(0.9, 0, 0);
    santa.add(leftArm, rightArm);

    // ====== НОГИ ======
    const legGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const leftLeg = new THREE.Mesh(legGeo, black);
    const rightLeg = new THREE.Mesh(legGeo, black);
    rightLeg.position.set(-0.3, -1.3, 0);
    leftLeg.position.set(0.3, -1.3, 0);
    santa.add(leftLeg, rightLeg);

    // ====== НОС ======
    const noseGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const nose = new THREE.Mesh(noseGeo, skin);
    nose.position.set(0, 1.4, 0.55);
    santa.add(nose);

    santa.userData = {
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
    };

    santa.scale.set(2, 2, 2);
    santa.position.y = 4;

    return santa;
  }
}
