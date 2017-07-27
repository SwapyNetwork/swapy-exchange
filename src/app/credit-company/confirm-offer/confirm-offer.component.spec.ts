import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOfferComponent } from './confirm-offer.component';

describe('ConfirmOfferComponent', () => {
  let component: ConfirmOfferComponent;
  let fixture: ComponentFixture<ConfirmOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
