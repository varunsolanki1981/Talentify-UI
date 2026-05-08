import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recordcrud } from './recordcrud';

describe('Recordcrud', () => {
  let component: Recordcrud;
  let fixture: ComponentFixture<Recordcrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Recordcrud],
    }).compileComponents();

    fixture = TestBed.createComponent(Recordcrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
