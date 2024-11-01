import { TestBed } from '@angular/core/testing';

import { PrestamosServiceService } from './prestamos-service.service';

describe('PrestamosServiceService', () => {
  let service: PrestamosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrestamosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
