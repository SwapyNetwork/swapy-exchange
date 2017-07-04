import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationAddressComponent } from './verification-address.component';

describe('VerificationAddressComponent', () => {
  let component: VerificationAddressComponent;
  let fixture: ComponentFixture<VerificationAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
