import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegsitroComponent } from './add-regsitro.component';

describe('AddRegsitroComponent', () => {
  let component: AddRegsitroComponent;
  let fixture: ComponentFixture<AddRegsitroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRegsitroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRegsitroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
