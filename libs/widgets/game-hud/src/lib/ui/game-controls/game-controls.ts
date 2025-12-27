import { ChangeDetectionStrategy, Component, HostBinding, input, output } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { GameControlsClickEvent, GameControlsPosition } from '../../model';

@Component({
  selector: 'lib-game-controls',
  imports: [TuiButton, TuiIcon],
  templateUrl: './game-controls.html',
  styleUrl: './game-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameControls {
  public readonly position = input<GameControlsPosition>('bottom');

  @HostBinding('style.bottom')
  protected readonly bottomPosition =
    this.position() === 'bottom' ? '1rem' : 'auto';

  @HostBinding('style.top')
  protected readonly topPosition = this.position() === 'top' ? '1rem' : 'auto';

  public readonly controlsClickEvent = output<GameControlsClickEvent>();

  public buttonDown(type: GameControlsClickEvent['button']): void {
    this.controlsClickEvent.emit({ button: type, up: false });
  }

  public buttonUp(type: GameControlsClickEvent['button']): void {
    this.controlsClickEvent.emit({ button: type, up: true });
  }
}
