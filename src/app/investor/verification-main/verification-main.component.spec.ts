import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationMainComponent } from './verification-main.component';

describe('VerificationMainComponent', () => {
  let component: VerificationMainComponent;
  let fixture: ComponentFixture<VerificationMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
