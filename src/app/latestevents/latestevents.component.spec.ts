import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatesteventsComponent } from './latestevents.component';

describe('LatesteventsComponent', () => {
  let component: LatesteventsComponent;
  let fixture: ComponentFixture<LatesteventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LatesteventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LatesteventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
