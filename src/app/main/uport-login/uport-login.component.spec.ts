import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UportLoginComponent } from './uport-login.component';

describe('UportLoginComponent', () => {
  let component: UportLoginComponent;
  let fixture: ComponentFixture<UportLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UportLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UportLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
