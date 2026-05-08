import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardOfTrustees } from './board-of-trustees';

describe('BoardOfTrustees', () => {
  let component: BoardOfTrustees;
  let fixture: ComponentFixture<BoardOfTrustees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardOfTrustees],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardOfTrustees);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
