import * as THREE from 'three';

export class SnowParticles {
  private particles!: THREE.Points;
  private positions!: Float32Array;
  private velocities!: Float32Array;
  private sizes!: Float32Array;
  private time = 0;

  // Для привязки к Санте
  private prevTargetX = 0;
  private prevTargetZ = 0;

  private readonly numParticles = 8000;
  private readonly gravity = -2.5;
  private readonly windStrength = 0.5;

  constructor(private scene: THREE.Scene) {
    this.createParticles();
    this.scene.add(this.particles);
  }

  private createParticles() {
    this.positions = new Float32Array(this.numParticles * 3);
    this.velocities = new Float32Array(this.numParticles * 3);
    this.sizes = new Float32Array(this.numParticles);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
      depthWrite: false, // важно для избежания конфликтов с дорогой
    });

    this.particles = new THREE.Points(geometry, material);

    this.particles.frustumCulled = false;

    // Инициализация снежинок вокруг стартовой позиции (Z ≈ 0)
    for (let i = 0; i < this.numParticles; i++) {
      const i3 = i * 3;
      this.positions[i3] = (Math.random() - 0.5) * 200;           // X
      this.positions[i3 + 1] = Math.random() * 50 + 20;           // Y (высоко)
      this.positions[i3 + 2] = (Math.random() - 0.5) * 500;       // Z

      this.velocities[i3] = (Math.random() - 0.5) * 0.3;           // sway X
      this.velocities[i3 + 1] = -0.5 - Math.random() * 1;          // вниз
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.2;       // sway Z

      this.sizes[i] = 0.2 + Math.random() * 0.4;
    }

    geometry.attributes['position'].needsUpdate = true;
    geometry.attributes['size'].needsUpdate = true;
  }

  public update(delta: number, target: THREE.Object3D) {
    this.time += delta;

    const positions = this.positions;
    const velocities = this.velocities;

    // 1. Сдвигаем все снежинки "назад" относительно движения Санты
    const deltaX = target.position.x - this.prevTargetX;
    const deltaZ = target.position.z - this.prevTargetZ;

    for (let i = 0; i < this.numParticles; i++) {
      const i3 = i * 3;
      positions[i3] -= deltaX;     // X
      positions[i3 + 2] -= deltaZ;  // Z
    }

    // Сохраняем текущую позицию для следующего кадра
    this.prevTargetX = target.position.x;
    this.prevTargetZ = target.position.z;

    // 2. Анимация: гравитация, ветер, движение
    for (let i = 0; i < this.numParticles; i++) {
      const i3 = i * 3;

      // Гравитация (только по Y)
      velocities[i3 + 1] += this.gravity * delta;

      // Ветер (плавное покачивание)
      velocities[i3] += Math.sin(this.time * 2 + i * 0.1) * this.windStrength;
      velocities[i3 + 2] += Math.cos(this.time * 1.5 + i * 0.1) * this.windStrength;

      // Применяем скорость к позиции
      positions[i3] += velocities[i3] * delta;
      positions[i3 + 1] += velocities[i3 + 1] * delta;
      positions[i3 + 2] += velocities[i3 + 2] * delta;

      // Респавн, если снежинка упала ниже дороги (Y < 4)
      if (positions[i3 + 1] < 4) {
        positions[i3] = target.position.x + (Math.random() - 0.5) * 200;     // X относительно Санты
        positions[i3 + 1] = Math.random() * 50 + 20;     // Y высоко над Сантой
        positions[i3 + 2] = target.position.z + (Math.random() - 0.5) * 400; // Z вокруг Санты

        // Новая случайная скорость падения
        velocities[i3 + 1] = -0.5 - Math.random() * 1;
        velocities[i3] = (Math.random() - 0.5) * 0.3;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.2;
      }
    }

    // Обновляем буфер позиции для GPU
    // Обновляем буфер позиции для GPU
    this.particles.geometry.attributes['position'].needsUpdate = true;
  }

  public dispose() {
    this.scene.remove(this.particles);
    this.particles.geometry.dispose();
    (this.particles.material as THREE.Material).dispose();
  }
}
