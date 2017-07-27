import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfferComponent } from './add-offer.component';

describe('AddOfferComponent', () => {
  let component: AddOfferComponent;
  let fixture: ComponentFixture<AddOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
