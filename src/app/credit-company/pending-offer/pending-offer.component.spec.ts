import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulOfferComponent } from './successful-offer.component';

describe('SuccessfulOfferComponent', () => {
  let component: SuccessfulOfferComponent;
  let fixture: ComponentFixture<SuccessfulOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessfulOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfulOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
