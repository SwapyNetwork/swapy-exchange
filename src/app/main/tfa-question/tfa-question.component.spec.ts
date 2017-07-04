import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TfaQuestionComponent } from './tfa-question.component';

describe('TfaQuestionComponent', () => {
  let component: TfaQuestionComponent;
  let fixture: ComponentFixture<TfaQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TfaQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfaQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
