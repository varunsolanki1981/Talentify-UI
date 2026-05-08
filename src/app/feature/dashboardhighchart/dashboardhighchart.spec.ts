import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboardhighchart } from './dashboardhighchart';

describe('Dashboardhighchart', () => {
  let component: Dashboardhighchart;
  let fixture: ComponentFixture<Dashboardhighchart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Dashboardhighchart],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboardhighchart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
