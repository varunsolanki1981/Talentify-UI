import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailIconRendererComponent } from './email-icon-renderer-component';

describe('EmailIconRendererComponent', () => {
  let component: EmailIconRendererComponent;
  let fixture: ComponentFixture<EmailIconRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailIconRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailIconRendererComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
