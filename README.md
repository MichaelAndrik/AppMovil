# AppMovil

#Componentes

-Login con recuperacion de contraseña

Se utiliza dos componentes, login y recover-password, siendo el ultimo para recuperar contraseña y funciona por la siguiente función
```
async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }
```

-Chat

Envio de texto, envio de imagenes y archivos. Las funciones me permiten hacer el envio de mensajes de texto y almacenarlos en una coleccion llamada messages

```
sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }
```
```
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
```

Para guardar archivos o imagenes se utiliza una funcion denominada storeFilesFirebase
```
storeFilesFirebase(image: imgFile) {
      const fileId = this.chatService.afs.createId();
      
      this.chatService.filesCollection.doc(fileId).set(image).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
  }
```
Para tomar fotos dentro del chat se usa una funcion denominada takePhoto, para almacenar la imagen tomada recientemente.
```
takePhoto( sourceType ) {
    try {
      const options: CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType
      };

      this.camera.getPicture( options )
        .then( async( imageData ) => {
          console.log( 'IMAGE DATA', imageData );
          this.tmpImage = 'data:image/jpeg;base64,' + imageData;
          const putPictures = firebase.storage().ref( 'messages/' + this.imageId + '.jpeg' );
          putPictures.putString( this.tmpImage, 'data_url' ).then( ( snapshot ) => {
            console.log( 'snapshot', snapshot.ref );
          } );
          const getPicture = firebase.storage().ref( 'messages/' + this.imageId + '.jpeg' ).getDownloadURL();
          getPicture.then( ( url ) => {
            this.message = url;
          } );
        } )
        .catch( ( e ) => {
          console.log( e );
          this.tmpImage = undefined;
        } );
    } catch( e ) {
      console.log( e );
      this.tmpImage = undefined;
    }
  }
```
