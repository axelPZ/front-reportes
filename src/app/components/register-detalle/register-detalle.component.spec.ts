import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDetalleComponent } from './register-detalle.component';

describe('RegisterDetalleComponent', () => {
  let component: RegisterDetalleComponent;
  let fixture: ComponentFixture<RegisterDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
