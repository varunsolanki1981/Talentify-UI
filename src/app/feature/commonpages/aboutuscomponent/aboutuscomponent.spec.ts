import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aboutuscomponent } from './aboutuscomponent';

describe('Aboutuscomponent', () => {
  let component: Aboutuscomponent;
  let fixture: ComponentFixture<Aboutuscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Aboutuscomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Aboutuscomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
