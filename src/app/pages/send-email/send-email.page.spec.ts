import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendEmailPage } from './send-email.page';

describe('SendEmailPage', () => {
  let component: SendEmailPage;
  let fixture: ComponentFixture<SendEmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEmailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
