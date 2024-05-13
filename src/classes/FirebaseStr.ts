import { FirebaseStorage, StorageReference, getStorage, ref, uploadBytes } from "firebase/storage"
import { firebaseApp } from ".."
import sharp from "sharp"

export class FirebaseStr {

    private url_prefix: string
    private url_sufix: string
    private storage: FirebaseStorage
    private reference: StorageReference

    constructor(){
        this.storage = getStorage(firebaseApp)
        this.reference = ref(this.storage)
        this.url_prefix = 'https://firebasestorage.googleapis.com/v0/b/miw-tfm-moviemeter.appspot.com/o/users%2F'
        this.url_sufix = '.png?alt=media'
    }

    public async savePicture(picture: Express.Multer.File | undefined, userId: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                // Process the file data
                if (picture == undefined) 
                    resolve(this.url_prefix + 'default' + this.url_sufix);
                else {
                    const sharpImage = sharp(picture.buffer);
                    sharpImage.resize({ width: 300, height: 300, fit: 'cover', position: 'center' })
                    .toFormat('png')
                    .toBuffer()
                    .then(async (processedImageBuffer) => {
                        // Upload the processed image to Firebase Storage
                        this.reference = ref(this.storage, `users/${userId}.png`);
                        await uploadBytes(this.reference, processedImageBuffer, {
                            contentType: 'image/png'
                        })
    
                        // Resolve with the URL of the saved image
                        resolve(this.url_prefix + userId + this.url_sufix);
                    })
                    .catch((error) => {
                        reject(error);
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}