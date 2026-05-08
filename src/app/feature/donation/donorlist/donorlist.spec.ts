import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Donorlist } from './donorlist';

describe('Donorlist', () => {
  let component: Donorlist;
  let fixture: ComponentFixture<Donorlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Donorlist],
    }).compileComponents();

    fixture = TestBed.createComponent(Donorlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
