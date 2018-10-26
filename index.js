import { readFileSync, writeFileSync } from 'fs';
import PDF from './lib/pdf-parse.js';

export default PDF;

let isDebugMode = !module.parent; 

//process.env.AUTO_KENT_DEBUG


//for testing purpose
if (isDebugMode) {

    PDF.Options = {
        max: 0,
        version: 'v1.10.100',
        normalizeWhitespace: false,
        disableCombineTextItems: false
    };

    PDF.Custom(dataBuffer || path,function customPageRenderer(pageTextContent){

    });

    PDF.Text(dataBuffer || path).then((result)=>{
        
    });

    PDF.Table(dataBuffer || path).then((result)=>{
        
    });

    PDF.JSON(dataBuffer || path).then((result)=>{
        
    });

    PDF.XML(dataBuffer || path).then((result)=>{
        
    });



    let PDF_FILE = './test/data/05-versions-space.pdf';
    let dataBuffer = readFileSync(PDF_FILE);
    PDF(dataBuffer).then(function(data) {
        writeFileSync(`${PDF_FILE}.txt`, data.text, {
            encoding: 'utf8',
            flag: 'w'
        });
        debugger;
    }).catch(function(err) {
        debugger;
    });

}
