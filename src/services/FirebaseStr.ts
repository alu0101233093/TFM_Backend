import { firebaseAdminApp } from ".."
import sharp from "sharp"
import { FB_BUCKET_URL, FB_IMAGE_URL_PREFIX, FB_IMAGE_URL_SUFIX } from "../consts"

export class FirebaseStr {

    constructor(){}

    public async savePicture(picture: Express.Multer.File | undefined, userId: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                if (picture == undefined) {
                    resolve(FB_IMAGE_URL_PREFIX + 'default' + FB_IMAGE_URL_SUFIX)
                } else {
                    const sharpImage = sharp(picture.buffer)
                    sharpImage.resize({ width: 300, height: 300, fit: 'cover', position: 'center' })
                    .toFormat('png')
                    .toBuffer()
                    .then(async (processedImageBuffer) => {
                        const fileRef = firebaseAdminApp.storage()
                        .bucket(FB_BUCKET_URL)
                        .file(`users/${userId}.png`)

                        const stream = fileRef.createWriteStream({ metadata: { contentType: 'image/png' } })
                        stream.on('error', (error) => { reject(error) })
                        stream.on('finish', () => { resolve(FB_IMAGE_URL_PREFIX + userId + FB_IMAGE_URL_SUFIX) })
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

    public hasProfilePic(uid: string): Promise<[boolean]> {
        return firebaseAdminApp
        .storage()
        .bucket(FB_BUCKET_URL)
        .file(FB_IMAGE_URL_PREFIX + uid + FB_IMAGE_URL_SUFIX)
        .exists()
    }
}