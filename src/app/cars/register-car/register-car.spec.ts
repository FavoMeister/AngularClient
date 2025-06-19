import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCar } from './register-car';

describe('RegisterCar', () => {
  let component: RegisterCar;
  let fixture: ComponentFixture<RegisterCar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
