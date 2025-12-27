import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameOverMenu } from './game-over-menu';

describe('GameOverMenu', () => {
  let component: GameOverMenu;
  let fixture: ComponentFixture<GameOverMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOverMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(GameOverMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
