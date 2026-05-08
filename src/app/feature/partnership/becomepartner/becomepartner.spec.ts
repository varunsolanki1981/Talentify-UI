import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Becomepartner } from './becomepartner';

describe('Becomepartner', () => {
  let component: Becomepartner;
  let fixture: ComponentFixture<Becomepartner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Becomepartner],
    }).compileComponents();

    fixture = TestBed.createComponent(Becomepartner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
