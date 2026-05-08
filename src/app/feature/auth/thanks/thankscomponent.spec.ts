import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thankscomponent } from './thankscomponent';

describe('Thankscomponent', () => {
  let component: Thankscomponent;
  let fixture: ComponentFixture<Thankscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Thankscomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Thankscomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
