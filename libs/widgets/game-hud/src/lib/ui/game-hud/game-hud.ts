import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { GameStateEventData } from '@newyear-runner/runner';

@Component({
  selector: 'lib-game-hud',
  imports: [],
  templateUrl: './game-hud.html',
  styleUrl: './game-hud.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameHud {
  public readonly gameState = input.required<GameStateEventData>();

  protected readonly score = computed(() => this.gameState().score);
  protected readonly lives = computed(() => new Array(this.gameState().lives));
}
