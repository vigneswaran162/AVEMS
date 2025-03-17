import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterstiondataComponent } from './registerstiondata.component';

describe('RegisterstiondataComponent', () => {
  let component: RegisterstiondataComponent;
  let fixture: ComponentFixture<RegisterstiondataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterstiondataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterstiondataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
