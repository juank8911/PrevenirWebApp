import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearEstudioMedicoComponent } from './modal-crear-estudio-medico.component';

describe('ModalCrearEstudioMedicoComponent', () => {
  let component: ModalCrearEstudioMedicoComponent;
  let fixture: ComponentFixture<ModalCrearEstudioMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCrearEstudioMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCrearEstudioMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
