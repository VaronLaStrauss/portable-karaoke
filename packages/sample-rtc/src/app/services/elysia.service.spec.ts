import { TestBed } from '@angular/core/testing';

import { ElysiaService } from './elysia.service';

describe('ElysiaService', () => {
  let service: ElysiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElysiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
