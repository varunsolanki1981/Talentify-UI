import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Institutionalcomponent } from './institutionalcomponent';

describe('Institutionalcomponent', () => {
  let component: Institutionalcomponent;
  let fixture: ComponentFixture<Institutionalcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Institutionalcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Institutionalcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
