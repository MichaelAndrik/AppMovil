import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestoreCollection } from '@angular/fire/firestore';

export interface User {
  uid: string;
  email: string;
  emailVerified:boolean,
}

export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}


export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  currentUser: User = null;

  public filesCollection: AngularFirestoreCollection<imgFile>;
  // File upload task 
  fileUploadTask: AngularFireUploadTask;

  // Upload progress
  percentageVal: Observable<number>;

  // Track file uploading with snapshot
  trackSnapshot: Observable<any>;

  // Uploaded File URL
  UploadedImageURL: Observable<string>;

  // Uploaded image collection
  files: Observable<imgFile[]>;

  // Image specifications
  imgName: string;
  imgSize: number;

  // File uploading status
  isFileUploading: boolean;
  isFileUploaded: boolean;

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore, public afStorage: AngularFireStorage, ) {
    this.afAuth.onAuthStateChanged(user => {
      console.log('User: ', user.providerData[0].uid);
      this.currentUser = user;
    });
    this.isFileUploading = false;
    this.isFileUploaded = false;
    
    // Define uploaded files collection
    this.filesCollection = afs.collection<imgFile>('imagesCollection');
    this.files = this.filesCollection.valueChanges();
  }
  

  async sendVerificationEmail(): Promise<void> {
    return (await this.afAuth.currentUser).sendEmailVerification();
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }
  
  async login({ email, password }) {
    try{
      const credential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return credential;
    }catch (error){
      console.log(error);
    }
  }

  logout() {
    return this.afAuth.signOut();
  }

  async register({ email, password }) {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    this.sendVerificationEmail();
  }
  addChatMessage(msg) {
    if( this.imgName!== undefined ) {
      return this.afs.collection('messages').add({
        msg,
        from: this.currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
    } else {
      return this.afs.collection('messages').add({
        msg,
        from: this.currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
      });
    }
  }

  getChatMessages() {
    let users = [];

    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        console.log('all users: ', users);
        return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<Message[]>
      }),
      map(messages => {
        for (let m of messages) {
          m.fromName = this.getUserForMsg(m.from, users);
          m.myMsg = this.currentUser.uid === m.from;
        }
        console.log('all messages: ', messages);
        return messages;
      })
    )
  }

  getUsers() {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }
   
  getUserForMsg(msgFromId, users: User[]): string {    
    for (let usr of users) {
      if (usr.uid == msgFromId) {
        return usr.email;
      }
    }
    return 'User';
  }


}
