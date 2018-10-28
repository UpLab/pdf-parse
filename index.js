const pdf = require('./lib/pdf-parse.js');

module.exports = pdf;

let isDebugMode = ! module.parent;

//process.env.AUTO_KENT_DEBUG
//for testing purpose
if (isDebugMode) {
    const FS = require('fs');
    let pdfPath = './test/data/05-versions-space.pdf';
    let dataBuffer = FS.readFileSync(pdfPath);

    pdf.options = {
        max: 0,
        version: 'default',
        normalizeWhitespace: false,
        disableCombineTextItems: false,
        disableWorker: true,
        verbosity: -1
    };

    let customPageRenderer = function (pageContent){
        let currentPageText = "";
        let currentYPosition = null;
        let lastYPosition = null;

        for (let item of pageContent.items) {
            currentYPosition = item.transform[5];
    
            if (lastYPosition == currentYPosition || lastYPosition == null){
                currentPageText = `${currentPageText}${item.str}`;
            }  
            else{
                currentPageText =`${currentPageText}\n${item.str}`;
            } 
            lastYPosition = currentYPosition;
        }
        return currentPageText;
    }

    pdf.custom(dataBuffer,customPageRenderer).then((custom)=>{
        
    });
    
    pdf.text(dataBuffer).then((text)=>{

    });

    pdf.info(dataBuffer).then((info)=>{

    });

    pdf.table(dataBuffer).then((table)=>{

    });

    pdf.xml(dataBuffer).then((table)=>{

    });

    pdf.json(dataBuffer).then((table)=>{

    });

    /*
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
    */

}
