import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailModalRendererComponent } from './email-modal-renderer-component';

describe('EmailModalRendererComponent', () => {
  let component: EmailModalRendererComponent;
  let fixture: ComponentFixture<EmailModalRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailModalRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailModalRendererComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
