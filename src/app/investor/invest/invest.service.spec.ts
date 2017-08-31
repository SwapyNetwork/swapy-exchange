import { TestBed, inject } from '@angular/core/testing';

import { InvestService } from './invest.service';

describe('InvestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvestService]
    });
  });

  it('should be created', inject([InvestService], (service: InvestService) => {
    expect(service).toBeTruthy();
  }));
});
