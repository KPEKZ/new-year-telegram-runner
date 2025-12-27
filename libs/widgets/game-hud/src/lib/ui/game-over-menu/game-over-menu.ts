import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButton, type TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { GameOverMenuSelectEvent } from '../../model';

@Component({
  selector: 'lib-game-over-menu',
  imports: [TuiButton],
  templateUrl: './game-over-menu.html',
  styleUrl: './game-over-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOverMenu {
  public readonly context =
    injectContext<
      TuiDialogContext<GameOverMenuSelectEvent, number>
    >();

  public readonly score = this.context.data;

  public selectMenuButton(type: GameOverMenuSelectEvent): void {
    this.context.completeWith(type);
  }
}
