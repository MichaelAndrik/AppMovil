import { Message } from './../../services/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { imgFile } from './../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
 
  messages: Observable<Message[]>;
  newMsg = '';
  
  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }

  logout() {
    this.chatService.logout().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }
  uploadImage(event: FileList) {
      
    const file = event.item(0)

    // Image validation
    if (file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      return;
    }

    this.chatService.isFileUploading = true;
    this.chatService.isFileUploaded = false;

    this.chatService.imgName = file.name;

    // Storage path
    const fileStoragePath = `filesStorage/${new Date().getTime()}_${file.name}`;

    // Image reference
    const imageRef = this.chatService.afStorage.ref(fileStoragePath);

    // File upload task
    this.chatService.fileUploadTask = this.chatService.afStorage.upload(fileStoragePath, file);

    // Show uploading progress
    this.chatService.percentageVal = this.chatService.fileUploadTask.percentageChanges();
    this.chatService.trackSnapshot = this.chatService.fileUploadTask.snapshotChanges().pipe(
      
      finalize(() => {
        // Retreive uploaded image storage path
        this.chatService.UploadedImageURL = imageRef.getDownloadURL();
        
        this.chatService.UploadedImageURL.subscribe(resp=>{
          this.storeFilesFirebase({
            name: file.name,
            filepath: resp,
            size: this.chatService.imgSize
          });
          this.chatService.isFileUploading = false;
          this.chatService.isFileUploaded = true;
        },error=>{
          console.log(error);
        })
      }),
      tap(snap => {
          this.chatService.imgSize = snap.totalBytes;
      })
    )
  }


  storeFilesFirebase(image: imgFile) {
      const fileId = this.chatService.afs.createId();
      
      this.chatService.filesCollection.doc(fileId).set(image).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
  }
}
