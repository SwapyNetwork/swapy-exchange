import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationIdentityComponent } from './verification-identity.component';

describe('VerificationIdentityComponent', () => {
  let component: VerificationIdentityComponent;
  let fixture: ComponentFixture<VerificationIdentityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationIdentityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
