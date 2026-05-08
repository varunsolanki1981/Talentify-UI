import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Breadcrumbcomponent } from './breadcrumbcomponent';

describe('Breadcrumbcomponent', () => {
  let component: Breadcrumbcomponent;
  let fixture: ComponentFixture<Breadcrumbcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Breadcrumbcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Breadcrumbcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
