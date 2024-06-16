import { firebaseAdminApp } from ".."
import sharp from "sharp"
import { FB_BUCKET_URL, FB_IMAGE_URL_PREFIX, FB_IMAGE_URL_SUFIX } from "../consts"

export const FB_IMAGE_DEFAULT = FB_IMAGE_URL_PREFIX + 'default' + FB_IMAGE_URL_SUFIX

export class FirebaseStr {

    constructor(){}

    public async savePicture(picture: Express.Multer.File | undefined, userId: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (picture == undefined) {
                resolve(FB_IMAGE_DEFAULT)
            } else {
                this.formatImage(picture)
                .then(async (processedImageBuffer) => {
                    const fileRef = firebaseAdminApp.storage()
                    .bucket(FB_BUCKET_URL)
                    .file(`users/${userId}.png`)

                    const stream = fileRef.createWriteStream({ metadata: { contentType: 'image/png' } })
                    stream.on('error', (error) => {reject({message: "Error saving photo. ", error})})
                    stream.on('finish', () => {resolve(FB_IMAGE_URL_PREFIX + userId + FB_IMAGE_URL_SUFIX)})
                    stream.end(processedImageBuffer)
                }).catch((error) => {
                    reject({message: "Error formating photo. ", error})
                })
            }
        })
    }

    private formatImage(picture: Express.Multer.File){
        const sharpImage = sharp(picture.buffer)
        return sharpImage.resize({ width: 300, height: 300, fit: 'cover', position: 'center' })
        .toFormat('png').toBuffer()
    }

    public hasProfilePic(uid: string): Promise<[boolean]> {
        return firebaseAdminApp
        .storage()
        .bucket(FB_BUCKET_URL)
        .file('users/' + uid + '.png')
        .exists()
    }

    public deleteProfilePic(uid: string) {
        return new Promise<void>(async (resolve,reject) => {
            return firebaseAdminApp
            .storage()
            .bucket(FB_BUCKET_URL)
            .file('users/' + uid + '.png')
            .delete()
            .then(() => resolve())
            .catch((error: any) => {
                if(error.code == 404) {
                    resolve()
                } else {
                    reject({message: "Error deleting profile picture. ", error})
                }
            })
        })
    }
}