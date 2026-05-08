import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forgotcomponent } from './forgotcomponent';

describe('Forgotcomponent', () => {
  let component: Forgotcomponent;
  let fixture: ComponentFixture<Forgotcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Forgotcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Forgotcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
