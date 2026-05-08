import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Corporatecomponent } from './corporatecomponent';

describe('Corporatecomponent', () => {
  let component: Corporatecomponent;
  let fixture: ComponentFixture<Corporatecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Corporatecomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Corporatecomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
