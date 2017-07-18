import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TfaSetupComponent } from './tfa-setup.component';

describe('TfaSetupComponent', () => {
  let component: TfaSetupComponent;
  let fixture: ComponentFixture<TfaSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TfaSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfaSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
