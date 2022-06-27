import axios from 'axios';
import { createWriteStream } from 'fs-extra';

// https://stackoverflow.com/a/61269447/3213175
export default async function downloadFile(fileUrl: string, outputLocationPath: string) {
    return axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(response => {
        // Ensure that the user can call `then()` only when the file has been downloaded entirely.
        return new Promise((resolve, reject) => {
            const writer = createWriteStream(outputLocationPath);

            response.data.pipe(writer);

            let error: Error;

            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });

            writer.on('close', () => {
                if (!error) {
                    resolve(true);
                }
                // No need to call the reject here, as it will have been called in the 'error' stream;
            });
        });
    });
}
