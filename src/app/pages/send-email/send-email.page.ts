import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../services/chat.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.page.html',
  styleUrls: ['./send-email.page.scss'],
  providers: [ChatService]
})

export class SendEmailPage implements OnDestroy {
  public user$: Observable<User> = this.chatService.afAuth.user;

  constructor(
    private router: Router,
    private chatService: ChatService) {}

  onSendEmail(): void {
    this.chatService.sendVerificationEmail();
  }

  ngOnDestroy() {
    this.chatService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}