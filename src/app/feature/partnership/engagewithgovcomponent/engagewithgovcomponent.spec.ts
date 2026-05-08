import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Engagewithgovcomponent } from './engagewithgovcomponent';

describe('Engagewithgovcomponent', () => {
  let component: Engagewithgovcomponent;
  let fixture: ComponentFixture<Engagewithgovcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Engagewithgovcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Engagewithgovcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
