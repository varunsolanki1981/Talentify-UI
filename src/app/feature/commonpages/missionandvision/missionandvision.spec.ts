import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Missionandvision } from './missionandvision';

describe('Missionandvision', () => {
  let component: Missionandvision;
  let fixture: ComponentFixture<Missionandvision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Missionandvision],
    }).compileComponents();

    fixture = TestBed.createComponent(Missionandvision);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
