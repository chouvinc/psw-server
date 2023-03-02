import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { ReceiptParser } from './src/io/parsers';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const multerUploadsFolder = multer({
  // TODO: figure out a better place for this later
  dest: `${__dirname}/uploads/`
});

app.get('/', (req: Request, res: Response) => {
  res.send('hello ayy lmao XD');
});
  
app.post('/upload_receipts', multerUploadsFolder.array("receipts"), async (req: Request, res: Response) => {
  // TODO make this into a service handler and dependency inject ReceiptParser
  // figure out how to type this properly

  if (req.files) {
    const typedFiles = req.files as Express.Multer.File[];
    const singularPromise = Promise.all(typedFiles.map((file) => {
      const parserForFile = new ReceiptParser(file);
      return parserForFile.output();
    }));

    const receipts = await singularPromise;
    console.log(receipts);
  }

  res.send('Go back to the last page!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
