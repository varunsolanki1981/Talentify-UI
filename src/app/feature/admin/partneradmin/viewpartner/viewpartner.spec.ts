import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewpartner } from './viewpartner';

describe('Viewpartner', () => {
  let component: Viewpartner;
  let fixture: ComponentFixture<Viewpartner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewpartner],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewpartner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
