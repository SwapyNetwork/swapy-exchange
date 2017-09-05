import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulInvestmentComponent } from './successful-investment.component';

describe('SuccessfulInvestmentComponent', () => {
  let component: SuccessfulInvestmentComponent;
  let fixture: ComponentFixture<SuccessfulInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessfulInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfulInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
