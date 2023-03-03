import Receipt from '../model/Receipt';
import Tesseract from 'tesseract.js';
import Jimp from 'jimp';

interface Parser<T, U> {
    // don't want folks mutating input while we're using the parser
    readonly rawInput: T;
    
    output(): U;
}

class ReceiptParser implements Parser<string, Promise<Receipt>>  {

    // TODO: move this to config
    private static readonly ENHANCED_SUFFIX = "_enhanced.jpg";
    // TODO: support other currencies
    private static readonly DOLLAR = "$";
    // TODO: experiment with more kernels
    private static readonly SHARPEN_KERNEL = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ];

    private static readonly NUMERICAL_REGEX =/^.*\d+\.\d*$/

    readonly receiptOriginalName: string;
    readonly rawInput: string;
    constructor({ path, originalname }: Express.Multer.File) {
        this.rawInput = path;
        this.receiptOriginalName = originalname;
    }

    // TODO: if this gets slow consider returning a promise of a receipt instead
    async output(): Promise<Receipt> {
        // materialize some state in case the image processing goes wrong
        await Jimp
            .read(this.rawInput)
            .then((image: Jimp) => {
                return image
                    .scale(2)
                    .grayscale()
                    .quality(90)
                    .normalize();
            })
            .then((image: Jimp)=> image.write(this.withExtendedImage()));

        return Tesseract.recognize(
            this.withExtendedImage(),
            'eng',
            // { logger: m => console.log(m) }
          ).then(({ data: { text } }) => {
            return Receipt.new(
                this.receiptOriginalName,
                text.split("\n").filter(s => {
                    return ReceiptParser.NUMERICAL_REGEX.test(s);
                }),
                69.420
            );
          });

    }

    private withExtendedImage(): string {
        return `${this.rawInput}${ReceiptParser.ENHANCED_SUFFIX}`;
    }
}

export {
    Parser,
    ReceiptParser,
}