import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPassComponent } from './request-pass.component';

describe('RequestPassComponent', () => {
  let component: RequestPassComponent;
  let fixture: ComponentFixture<RequestPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
