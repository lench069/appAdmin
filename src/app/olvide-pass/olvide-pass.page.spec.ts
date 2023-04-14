import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OlvidePassPage } from './olvide-pass.page';

describe('OlvidePassPage', () => {
  let component: OlvidePassPage;
  let fixture: ComponentFixture<OlvidePassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlvidePassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OlvidePassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
