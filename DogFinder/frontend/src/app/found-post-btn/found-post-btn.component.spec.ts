import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoundPostBtnComponent } from './found-post-btn.component';

describe('FoundPostBtnComponent', () => {
  let component: FoundPostBtnComponent;
  let fixture: ComponentFixture<FoundPostBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoundPostBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FoundPostBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
