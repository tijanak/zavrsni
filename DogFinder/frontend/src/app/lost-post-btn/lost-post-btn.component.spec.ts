import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LostPostBtnComponent } from './lost-post-btn.component';

describe('LostPostBtnComponent', () => {
  let component: LostPostBtnComponent;
  let fixture: ComponentFixture<LostPostBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LostPostBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LostPostBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
