import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Partneradmin } from './partneradmin';

describe('Partneradmin', () => {
  let component: Partneradmin;
  let fixture: ComponentFixture<Partneradmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Partneradmin],
    }).compileComponents();

    fixture = TestBed.createComponent(Partneradmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
