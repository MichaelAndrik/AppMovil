import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: ChatService) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register(){
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
 
    this.chatService
      .login(this.credentialForm.value)
      .then(
        async (res) => {
          loading.dismiss();
          const user = await this.chatService.login(this.credentialForm.value);
          this.checkUserIsVerified(user.user);
        },
        async (err) => {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: ':(',
            message: err.message,
            buttons: ['OK'],
          });
 
          await alert.present();
        }
      );
  }
  recoverPassword(){
    this.router.navigateByUrl('/recover-password', { replaceUrl: true });
  }
 
  // Easy access for form fields
  get email() {
    return this.credentialForm.get('email');
  }
  
  get password() {
    return this.credentialForm.get('password');
  }

  private checkUserIsVerified(user) {
    if (user && user.emailVerified) {
      this.router.navigateByUrl('/chat', { replaceUrl: true });
    } else if (user){
      this.router.navigateByUrl('/verification-email', { replaceUrl: true });
    } else{
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }

}
