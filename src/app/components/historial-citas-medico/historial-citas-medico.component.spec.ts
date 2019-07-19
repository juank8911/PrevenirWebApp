import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCitasMedicoComponent } from './historial-citas-medico.component';

describe('HistorialCitasMedicoComponent', () => {
  let component: HistorialCitasMedicoComponent;
  let fixture: ComponentFixture<HistorialCitasMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialCitasMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialCitasMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
