import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelAssetComponent } from './cancel-asset.component';

describe('CancelAssetComponent', () => {
  let component: CancelAssetComponent;
  let fixture: ComponentFixture<CancelAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
