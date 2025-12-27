import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  INJECTOR, untracked,
  viewChild,
} from '@angular/core';
import { GameEngine, GameStateEventData, MainScene } from '@newyear-runner/runner';
import { firstValueFrom, fromEvent, map, shareReplay, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  GameHud,
  GameControls,
  GameControlsClickEvent,
  GameOverMenu,
  GameOverMenuSelectEvent,
} from '@newyear-runner/game-hud';
import { tuiDialog } from '@taiga-ui/core';
import WebApp from '@twa-dev/sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-game-page',
  imports: [GameHud, GameControls],
  templateUrl: './game-page.html',
  styleUrl: './game-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePage {
  private readonly _injector = inject(INJECTOR);
  private readonly _router = inject(Router);
  private readonly _dialog = tuiDialog(GameOverMenu, {
    injector: this._injector,
    dismissible: false,
    closeable: false,
  });

  private readonly _canvasRef =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private readonly _engine = computed(
    () => new GameEngine(this._canvasRef().nativeElement)
  );

  private readonly _canvas$ = toObservable(this._canvasRef).pipe(
    map((ref) => ref.nativeElement),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  private readonly gameState$ = this._canvas$.pipe(
    switchMap((canvas) =>
      fromEvent<CustomEvent<GameStateEventData>>(canvas, 'gameState')
    ),
    map((event) => event.detail)
  );

  protected readonly gameState = toSignal(this.gameState$, {
    initialValue: {
      score: 0,
      lives: 3,
      isGameOver: false,
    } as GameStateEventData,
  });

  public handleHudControlButtons(event: GameControlsClickEvent): void {
    const scene = this._engine().currentScene;

    if (!scene || !(scene instanceof MainScene)) {
      return;
    }

    switch (event.button) {
      case 'left':
        if (event.up) {
          scene.controller.resetMoveLeftAndRight();
        } else {
          scene.controller.moveLeft();
        }
        break;
      case 'right':
        if (event.up) {
          scene.controller.resetMoveLeftAndRight();
        } else {
          scene.controller.moveRight();
        }
        break;
      default:
        scene.controller.jump();
    }
  }

  constructor() {
    effect(() => {
      this._engine().startScene('main');
    });

    effect(async () => {
      const gameState = this.gameState();
      const engine = untracked(this._engine);

      if (gameState.isGameOver) {
        const menuSelectEvent = await firstValueFrom(this._dialog(gameState.score));
        this.handleGameOverMenu(menuSelectEvent, engine);
      }
    });
  }

  private handleGameOverMenu(
    menuSelectType: GameOverMenuSelectEvent,
    gameEngine: GameEngine
  ) {
    switch (menuSelectType) {
      case 'restart':
        gameEngine.currentScene?.restart();
        break;
      case 'menu':
        this._router.navigate(['']);
        break;
      default:
        WebApp.close();
    }
  }

  @HostListener('window:resize')
  public onResize() {
    this._engine().resize();
  }
}
