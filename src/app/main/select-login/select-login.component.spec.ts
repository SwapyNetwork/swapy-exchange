import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLoginComponent } from './select-login.component';

describe('SelectLoginComponent', () => {
  let component: SelectLoginComponent;
  let fixture: ComponentFixture<SelectLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
