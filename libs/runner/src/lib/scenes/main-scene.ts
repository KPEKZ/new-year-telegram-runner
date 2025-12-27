import * as THREE from 'three';
import {
  BaseScene,
  GiftManager,
  ObstacleManager,
  SantaController,
} from '../core';
import { Santa, SnowRoad, ThirdPersonCamera } from '../models';
import { SnowParticles, FootprintsEffect } from '../effects';
import { GameStateEventData } from '../types';
import { IController } from '../core/interfaces/i-controller';

export class MainScene extends BaseScene {
  private readonly _santa = new Santa();
  private readonly _controller = new SantaController(this._santa);
  private readonly _cameraController: ThirdPersonCamera = new ThirdPersonCamera(
    this.camera,
    this._santa.model
  );
  private readonly _obstaclesManager = new ObstacleManager(this.scene);
  private readonly _giftManager = new GiftManager(this.scene);
  private readonly _road = new SnowRoad(
    this.scene,
    this._giftManager,
    this._obstaclesManager
  );
  private readonly _snowParticles = new SnowParticles(this.scene);
  private readonly _footprintsEffect = new FootprintsEffect(this.scene);

  private readonly _audioLoader = new THREE.AudioLoader();
  private readonly _audioListener = new THREE.AudioListener();
  private readonly _backgroundAudio = new THREE.Audio(this._audioListener);
  private _audioBuffers: AudioBuffer[] = [];
  private _animationTime = 0;

  private _gameState: GameStateEventData = {
    score: 0,
    lives: 3,
    isGameOver: false,
  };
  private readonly _speedCoeff = 0.25;
  private _current_speed = 0.5;
  private _lastSpeedIncreaseScore = 0;
  public async init(): Promise<void> {
    this.scene.background = new THREE.Color('#87CEEB');
    this.camera.position.set(10, 10, 5);
    this.camera.add(this._audioListener);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-10, 5, -20);
    this.scene.add(light);

    const loadedBuffers = await Promise.all([
      await this._audioLoader.loadAsync('sounds/santa-run.mp3'),
      await this._audioLoader.loadAsync('sounds/sparkle.mp3'),
      await this._audioLoader.loadAsync('sounds/hoho.mp3'),
      await this._audioLoader.loadAsync('sounds/gameover.mp3'),
    ]);

    loadedBuffers.forEach((buffer) => this._audioBuffers.push(buffer));

    this._backgroundAudio.setBuffer(loadedBuffers[0]);
    this._backgroundAudio.setLoop(true);
    this._backgroundAudio.setVolume(0.5);
    this._backgroundAudio.play();

    await this._giftManager.init();
    await this._obstaclesManager.init();
    await this._road.init();

    this.scene.add(this._santa.model);

    this.dispatchGameEvent('gameState', this._gameState);

  }

  public get controller(): IController {
    return this._controller;
  }

  public update(delta: number): void {
    if (this._gameState.isGameOver) {
      return;
    }

    this.updateSantaRun(delta);
    this._controller.update();

    this._road.update(this._santa.model);
    this._giftManager.checkCollisions(this._santa.model, () => {
      this._gameState.score += 10;
      this.dispatchGameEvent('gameState', this._gameState);

      this.playEffect(1);
    });

    this._obstaclesManager.checkCollisions(this._santa.model, () => {
      this._gameState.lives -= 1; // -жизнь

      this.playEffect(2);

      if (this._gameState.lives === 0) {
        this._gameState.isGameOver = true;

        this._backgroundAudio.stop();
        this.playEffect(3);
      }

      this.dispatchGameEvent('gameState', this._gameState);
    });

    this._snowParticles.update(delta, this._santa.model);
    this._cameraController.update();
    this.renderer.render(this.scene, this.camera);
  }

  private updateSantaRun(delta: number): void {
    if (!this._santa) return;

    const { leftArm, rightArm, leftLeg, rightLeg } = this._santa.model
      .userData as Record<string, THREE.Mesh>;

    this._animationTime += delta;
    const animationSpeed = 1.5;

    const angle = Math.sin(this._animationTime * animationSpeed * Math.PI * 2);

    leftArm.rotation.x = angle;
    rightArm.rotation.x = -angle;
    leftLeg.rotation.x = -angle;
    rightLeg.rotation.x = angle;

    // Увеличиваем скорость каждые 250 очков
    if (this._gameState.score >= this._lastSpeedIncreaseScore + 250) {
      this._current_speed += this._speedCoeff;
      this._lastSpeedIncreaseScore =
        Math.floor(this._gameState.score / 250) * 250;
    }

    this._santa.model.position.z += this._current_speed;

    this._footprintsEffect?.spawnFootprint(
      rightLeg.position.clone().applyMatrix4(this._santa.model.matrixWorld),
      false
    );
    this._footprintsEffect?.spawnFootprint(
      leftLeg.position.clone().applyMatrix4(this._santa.model.matrixWorld),
      true
    );
  }

  private dispatchGameEvent(
    eventName: string,
    detail: GameStateEventData
  ): void {
    const event = new CustomEvent<GameStateEventData>(eventName, {
      detail: {
        score: detail.score,
        lives: detail.lives,
        isGameOver: detail.isGameOver,
      },
    });
    this.canvas.dispatchEvent(event);
  }

  public resize(): void {
    if (!this.camera || !this.renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    this.renderer.setSize(width, height);

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private playEffect(bufferIndex: number) {
    const effectSound = new THREE.Audio(this._audioListener);
    effectSound.setBuffer(this._audioBuffers[bufferIndex]);
    effectSound.setVolume(0.7);
    effectSound.play();

    effectSound.onEnded = () => {
      effectSound.disconnect();
    };
  }

  public async restart() {
    this._current_speed = 0.5;
    this._lastSpeedIncreaseScore = 0;
    this._gameState = {
      score: 0,
      lives: 3,
      isGameOver: false,
    };

    this.dispatchGameEvent('gameState', this._gameState);

    this._backgroundAudio.play();

    if (this._santa) this._santa.model.position.set(0, 4, 0);
    this._santa.model.position.z += 0.5;
    this._giftManager.clearAll();
    this._obstaclesManager.clearAll();
    this._footprintsEffect.clearAll();
    this._road.clearAll();

    await this._road.reset();
  }
}
