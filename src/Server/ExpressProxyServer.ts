import express, { Request, Response } from 'express';
import Utils from '../Utils/Utils';
import { env } from '../env';
import crypto from 'crypto';

class ExpressProxyServer {

    private app = express();
    private port = 80;

    constructor() {

        this.app.get('/proxy', (req, res) => { this.proxyImage(req, res) })

        this.app.listen(this.port, () => {
            console.log(`[SERVER]: Image proxy server is running at http://localhost:${this.port}`);
        });
    }


    private async proxyImage(req: Request<any>, res: Response<any>): Promise<void> {
        const url = req.query?.url;

        if (!url) {
            res.send(`Please specify one url. (Example localhost:${this.port}/proxy?url=http://exampleimage.com)`)
            return
        }

        if (Utils.checkIfImageExist(url as string)) {
            const hash = crypto.createHash('md5').update(url as string).digest("hex");
            res.sendFile(`${env.ASSETS_FOLDER}${hash}.jpg`, { root: "." })
            return
        }

        const bufferImage = await Utils.downloadImage(url as string);

        if (!bufferImage) {
            res.send('Error getting image')
            return
        }

        const hash = await Utils.writeFile(url as string, bufferImage);

        res.sendFile(`${env.ASSETS_FOLDER}${hash}.jpg`, { root: "." })

    }


}


export default ExpressProxyServer;