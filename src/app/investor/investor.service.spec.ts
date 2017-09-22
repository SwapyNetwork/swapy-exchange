import { TestBed, inject } from '@angular/core/testing';

import { InvestorService } from './investor.service';

describe('InvestorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvestorService]
    });
  });

  it('should be created', inject([InvestorService], (service: InvestorService) => {
    expect(service).toBeTruthy();
  }));
});
