import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCompanyComponent } from './credit-company.component';

describe('CreditCompanyComponent', () => {
  let component: CreditCompanyComponent;
  let fixture: ComponentFixture<CreditCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
