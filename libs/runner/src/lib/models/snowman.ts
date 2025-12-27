import * as THREE from 'three';

export class Snowman {
  public model: THREE.Group = this.createSnowman();

  private createSnowman(): THREE.Group {
    const snowman = new THREE.Group();

    const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // снег
    const coalMat = new THREE.MeshStandardMaterial({ color: 0x222222 }); // уголь (глаза, пуговицы)
    const carrotMat = new THREE.MeshStandardMaterial({ color: 0xff8800 }); // морковка
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x111111 }); // шляпа

    // ====== НИЖНИЙ ШАР (самый большой) ======
    const bottomGeo = new THREE.SphereGeometry(1, 12, 10); // low-poly: мало сегментов
    const bottom = new THREE.Mesh(bottomGeo, snowMat);
    bottom.position.y = 0;
    snowman.add(bottom);

    // ====== СРЕДНИЙ ШАР ======
    const middleGeo = new THREE.SphereGeometry(0.7, 12, 10);
    const middle = new THREE.Mesh(middleGeo, snowMat);
    middle.position.y = 0.7 + 0.4; // над нижним
    snowman.add(middle);

    // ====== ГОЛОВА (верхний шар) ======
    const headGeo = new THREE.SphereGeometry(0.4, 12, 10);
    const head = new THREE.Mesh(headGeo, snowMat);
    head.position.y = 0.7 + 0.4 + 0.4 + 0.35;
    snowman.add(head);

    // ====== ГЛАЗА (два угля) ======
    const eyeGeo = new THREE.SphereGeometry(0.1, 8, 6);
    const leftEye = new THREE.Mesh(eyeGeo, coalMat);
    leftEye.position.set(-0.2, head.position.y + 0.2, 0.2);
    const rightEye = new THREE.Mesh(eyeGeo, coalMat);
    rightEye.position.set(0.2, head.position.y + 0.2, 0.2);
    snowman.add(leftEye, rightEye);

    // ====== НОС-МОРКОВКА (конус) ======
    const noseGeo = new THREE.ConeGeometry(0.2, 0.8, 8);
    const nose = new THREE.Mesh(noseGeo, carrotMat);
    nose.position.set(0, head.position.y + 0.1, 0.2);
    nose.rotation.x = Math.PI / 2; // направляем вперёд
    snowman.add(nose);

    // ====== ПУГОВИЦЫ НА ТУЛОВИЩЕ ======
    const buttonGeo = new THREE.SphereGeometry(0.12, 8, 6);
    const button1 = new THREE.Mesh(buttonGeo, coalMat);
    button1.position.set(0, middle.position.y, 0.7);
    const button2 = new THREE.Mesh(buttonGeo, coalMat);
    button2.position.set(0, bottom.position.y, 1);
    snowman.add(button1, button2);

    // ====== ШЛЯПА (цилиндр + круг) ======
    const hatBaseGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.2, 12);
    const hatBase = new THREE.Mesh(hatBaseGeo, hatMat);
    hatBase.position.y = head.position.y + 0.4 + 0.1;
    snowman.add(hatBase);

    const hatTopGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 12);
    const hatTop = new THREE.Mesh(hatTopGeo, hatMat);
    hatTop.position.y = head.position.y + 0.4 + 0.1 + 0.2;
    snowman.add(hatTop);

    // ====== РУКИ-ВЕТКИ (два цилиндра) ======
    const branchGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 6);
    const leftBranch = new THREE.Mesh(
      branchGeo,
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    leftBranch.position.set(-0.7, middle.position.y, 0);
    leftBranch.rotation.z = Math.PI / 2 + 0.5; // в сторону
    const rightBranch = new THREE.Mesh(
      branchGeo,
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    rightBranch.position.set(0.7, middle.position.y, 0);
    rightBranch.rotation.z = Math.PI / 2 - 0.5;
    snowman.add(leftBranch, rightBranch);

    // ====== ФИНАЛЬНО ======
    // snowman.scale.set(1.5, 1.5, 1.5); // размер как препятствие

    return snowman;
  }
}
