import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationPhoneComponent } from './verification-phone.component';

describe('VerificationPhoneComponent', () => {
  let component: VerificationPhoneComponent;
  let fixture: ComponentFixture<VerificationPhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationPhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
