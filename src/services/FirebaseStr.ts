import { firebaseAdminApp } from "../app";
import sharp from "sharp"
import { FB_BUCKET_URL, FB_IMAGE_URL_PREFIX, FB_IMAGE_URL_SUFIX } from "../consts"

export const FB_IMAGE_DEFAULT = FB_IMAGE_URL_PREFIX + 'default' + FB_IMAGE_URL_SUFIX

export class FirebaseStr {

    private storageBucket

    constructor(){
        this.storageBucket = firebaseAdminApp.storage().bucket(FB_BUCKET_URL)
    }

    public async savePicture(picture: Express.Multer.File | undefined, userId: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (picture == undefined) {
                resolve(FB_IMAGE_DEFAULT)
            } else {
                this.formatImage(picture)
                .then(async (processedImageBuffer) => {
                    const fileRef = this.storageBucket.file(`users/${userId}.png`)
                    const stream = fileRef.createWriteStream({ metadata: { contentType: 'image/png' } })

                    stream.on('error', (error) => {
                        return reject(new CustomError('Error saving photo.', error));
                    })
                    stream.on('finish', () => {resolve(FB_IMAGE_URL_PREFIX + userId + FB_IMAGE_URL_SUFIX)})
                    stream.end(processedImageBuffer)
                }).catch((error) => {
                    return reject(new CustomError('Error formating photo.', error));
                })
            }
        })
    }

    private formatImage(picture: Express.Multer.File): Promise<Buffer>{
        const sharpImage = sharp(picture.buffer)
        return sharpImage.resize({ width: 300, height: 300, fit: 'cover', position: 'center' })
        .toFormat('png').toBuffer()
    }

    public hasProfilePic(uid: string): Promise<[boolean]> {
        return this.storageBucket
        .file('users/' + uid + '.png')
        .exists()
    }

    public deleteProfilePic(uid: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.storageBucket
            .file('users/' + uid + '.png')
            .delete()
            .then(() => {return resolve()})
            .catch((error: any) => {
                if(error.code == 404) {
                    return resolve()
                } else {
                    return reject(new CustomError('Error deleting profile picture.'));
                }
            })
        })
    }
}