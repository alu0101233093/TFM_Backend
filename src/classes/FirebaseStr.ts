import { firebaseAdminApp } from ".."
import sharp from "sharp"

export class FirebaseStr {

    private url_prefix: string
    private url_sufix: string

    constructor(){
        this.url_prefix = 'https://firebasestorage.googleapis.com/v0/b/miw-tfm-moviemeter.appspot.com/o/users%2F'
        this.url_sufix = '.png?alt=media'
    }

    public async savePicture(picture: Express.Multer.File | undefined, userId: string): Promise<string> {
        
        return new Promise<string>((resolve, reject) => {
            try {
                if (picture == undefined) {
                    resolve(this.url_prefix + 'default' + this.url_sufix)
                } else {
                    const sharpImage = sharp(picture.buffer)
                    sharpImage.resize({ width: 300, height: 300, fit: 'cover', position: 'center' })
                    .toFormat('png')
                    .toBuffer()
                    .then(async (processedImageBuffer) => {
                        const fileRef = firebaseAdminApp.storage()
                        .bucket('miw-tfm-moviemeter.appspot.com')
                        .file(`users/${userId}.png`)

                        const stream = fileRef.createWriteStream({
                            metadata: {
                            contentType: 'image/png'
                            }
                        })
                        stream.on('error', (error) => {
                            reject(error)
                        })
            
                        stream.on('finish', () => {
                            resolve(this.url_prefix + userId + this.url_sufix)
                        })
            
                        stream.end(processedImageBuffer)
                    })
                    .catch((error) => {
                        reject(error)
                    })
                }
            } catch (error) {
                reject(error)
            }
        })
    }
}