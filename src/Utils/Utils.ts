
import fs from 'fs';
import { env } from '../env';
import crypto from 'crypto';
import axios from 'axios';


class Utils {


    checkIfImageExist(url: string): boolean {
        const hash = crypto.createHash('md5').update(url).digest("hex");
        const imageExist = fs.existsSync(`${env.ASSETS_FOLDER}${hash}.jpg`);
        return imageExist
    }


    writeFile(url: string, buffer: Buffer): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const hash = crypto.createHash('md5').update(url).digest("hex");
            fs.writeFile(`${env.ASSETS_FOLDER}${hash}.jpg`, buffer, { flag: "w" }, () => {
                resolve(hash)
            })
        })
    }


    async downloadImage(url: string): Promise<Buffer | false> {
        return new Promise<Buffer | false>(async (resolve) => {
            try {
                const axiosResponse = await axios.get(url, { responseType: 'arraybuffer' });
                const axiosResponseStatus = axiosResponse.status
                console.log(axiosResponseStatus)
                if (axiosResponseStatus != 200 && axiosResponseStatus != 201) throw new Error('Error getting image')
                const bufferFromResponse = Buffer.from(axiosResponse.data, 'binary')
                resolve(bufferFromResponse)
            } catch (e) {
                console.log('Error getting image.')
                resolve(false)
            }
        })
    }

}


export default new Utils();