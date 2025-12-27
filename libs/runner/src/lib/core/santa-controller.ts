import { Santa } from "../models/santa";
import * as THREE from "three";
import { IController } from './interfaces/i-controller';

export class SantaController implements IController {
  private speedX = 0;
  private readonly moveSpeed = 0.5;
  private readonly maxX = 25;      // ширина дороги / разрешённый коридор
  private readonly jumpForce = 1.5;
  private readonly gravity = -0.07;

  private velocityY = 0;       // вертикальная скорость
  private isOnGround = true;

  constructor(private santa: Santa) {
    this.initControls();
  }

  private initControls() {
    window.addEventListener("keydown", (e) => {
      if (["ArrowLeft", "KeyA"].includes(e.code)) this.moveLeft();
      if (["ArrowRight", "KeyD"].includes(e.code)) this.moveRight();

      if (e.code === "Space") this.jump();
    });

    window.addEventListener("keyup", (e) => {
      if (['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(e.code)) {
       this.resetMoveLeftAndRight();
      }
    });
  }

  public moveRight(): void {
    this.speedX = -this.moveSpeed;
  }

  public moveLeft(): void {
    this.speedX = this.moveSpeed;
  }

  public resetMoveLeftAndRight(): void {
    this.speedX = 0;
  }

  public jump() {
    if (!this.isOnGround) return;

    this.velocityY = this.jumpForce;
    this.isOnGround = false;
  }

  public update() {
    const model = this.santa.model;

    // --- Горизонтальное движение ---
    model.position.x += this.speedX;
    model.position.x = THREE.MathUtils.clamp(model.position.x, -this.maxX, this.maxX);

    // --- Прыжок ---
    if (!this.isOnGround) {
      this.velocityY += this.gravity;
      model.position.y += this.velocityY;

      if (model.position.y <= 4) {
        model.position.y = 4;
        this.velocityY = 0;
        this.isOnGround = true;
      }
    }
  }
}
