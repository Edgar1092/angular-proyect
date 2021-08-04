import { TestBed } from '@angular/core/testing';

import { CorporativosService } from './corporativos.service';

describe('CorporativosService', () => {
  let service: CorporativosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorporativosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
