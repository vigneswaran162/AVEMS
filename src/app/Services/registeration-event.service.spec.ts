import { TestBed } from '@angular/core/testing';

import { RegisterationEventService } from './registeration-event.service';

describe('RegisterationEventService', () => {
  let service: RegisterationEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterationEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
