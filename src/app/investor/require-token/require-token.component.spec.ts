import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireTokenComponent } from './require-token.component';

describe('RequireTokenComponent', () => {
  let component: RequireTokenComponent;
  let fixture: ComponentFixture<RequireTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequireTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequireTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
