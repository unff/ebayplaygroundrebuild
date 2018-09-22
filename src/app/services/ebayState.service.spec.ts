import { TestBed } from '@angular/core/testing';

import { EbayStateService } from './ebayState.service';

describe('EbayStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EbayStateService = TestBed.get(EbayStateService);
    expect(service).toBeTruthy();
  });
});
