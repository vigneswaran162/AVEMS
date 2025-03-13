import { TestBed } from '@angular/core/testing';

import { ToastNofificationService } from './toast-nofification.service';

describe('ToastNofificationService', () => {
  let service: ToastNofificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastNofificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
