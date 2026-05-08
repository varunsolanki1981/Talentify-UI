import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rejectdialog } from './rejectdialog';

describe('Rejectdialog', () => {
  let component: Rejectdialog;
  let fixture: ComponentFixture<Rejectdialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Rejectdialog],
    }).compileComponents();

    fixture = TestBed.createComponent(Rejectdialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
