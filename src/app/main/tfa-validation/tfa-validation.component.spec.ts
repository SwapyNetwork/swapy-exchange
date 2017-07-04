import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TfaValidationComponent } from './tfa-validation.component';

describe('TfaValidationComponent', () => {
  let component: TfaValidationComponent;
  let fixture: ComponentFixture<TfaValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TfaValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfaValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
