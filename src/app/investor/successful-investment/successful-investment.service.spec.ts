import { TestBed, inject } from '@angular/core/testing';

import { SuccessfulInvestmentService } from './successful-investment.service';

describe('SuccessfulInvestmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuccessfulInvestmentService]
    });
  });

  it('should be created', inject([SuccessfulInvestmentService], (service: SuccessfulInvestmentService) => {
    expect(service).toBeTruthy();
  }));
});
