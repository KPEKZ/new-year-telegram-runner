import WebApp  from '@twa-dev/sdk';
import { TuiButton } from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-home-page',
  imports: [RouterLink,TuiButton],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {

  public onClose(): void {
    WebApp.close();
  }
}
