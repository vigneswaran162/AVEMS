import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterationListComponent } from './registeration-list.component';

describe('RegisterationListComponent', () => {
  let component: RegisterationListComponent;
  let fixture: ComponentFixture<RegisterationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
