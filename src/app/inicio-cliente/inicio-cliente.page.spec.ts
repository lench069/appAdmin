import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InicioClientePage } from './inicio-cliente.page';

describe('InicioClientePage', () => {
  let component: InicioClientePage;
  let fixture: ComponentFixture<InicioClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioClientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
