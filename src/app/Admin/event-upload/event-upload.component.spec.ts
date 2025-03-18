import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventUploadComponent } from './event-upload.component';

describe('EventUploadComponent', () => {
  let component: EventUploadComponent;
  let fixture: ComponentFixture<EventUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
