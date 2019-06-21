import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosYCondicionesPublicoComponent } from './terminos-y-condiciones-publico.component';

describe('TerminosYCondicionesPublicoComponent', () => {
  let component: TerminosYCondicionesPublicoComponent;
  let fixture: ComponentFixture<TerminosYCondicionesPublicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminosYCondicionesPublicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminosYCondicionesPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
