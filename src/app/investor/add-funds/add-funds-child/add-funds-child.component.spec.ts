import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFundsChildComponent } from './add-funds-child.component';

describe('AddFundsChildComponent', () => {
  let component: AddFundsChildComponent;
  let fixture: ComponentFixture<AddFundsChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFundsChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFundsChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
