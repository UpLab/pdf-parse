var PDFJS = null;

// depracated metod
// after depracation period ended just remove function render_page and
// var pdf = {};
var pdf = async function (dataBuffer, userOptions){
    let ret = {
        numpages: 0,
        numrender: 0,
        info: null,
        metadata: null,
        text: "",
        version: null
    };
    let options = checkOptions(userOptions);
    ret.version = PDFJS.version;
    let doc = await PDFJS.getDocument(dataBuffer);
    ret.numpages = doc.numPages;

    let metaData = await doc.getMetadata().catch(function(err) {
        return null;
    });

    ret.info = metaData ? metaData.info : null;
    ret.metadata = metaData ? metaData.metadata : null;

    let counter = options.max <= 0 ? doc.numPages : options.max;
    counter = counter > doc.numPages ? doc.numPages : counter;

    ret.text = "";

    for (var i = 1; i <= counter; i++) {
        let pageText = await doc.getPage(i).then(pageData => options.pagerender(pageData)).catch((err)=>{
            // todo log err using debug
            return "";
        });
        ret.text = `${ret.text}\n\n${pageText}`;
    }

    ret.numrender = counter;
    doc.destroy();

    return ret;
};

//depracated metod
function render_page(pageData,options) {
    return pageData.getTextContent(options)
    .then(function(textContent) {
        let lastY, text = '';
        for (let item of textContent.items) {
            if (!lastY || lastY.transform[5] == item.transform[5]){
                if(!lastY || lastY.transform[4] + lastY.width - item.transform[4] > -10){
                    text += item.str;
                }
                else{
                    text += " " + item.str;
                }
            }
            else{
                text += '\n' + item.str;
            }
            lastY = item;
        }            
        return text;
    });
}

const DEFAULT_OPTIONS = {
    pagerender: render_page,
    max: 0,
    version: 'v1.10.100',
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: false,
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false,
    disableWorker: true,
    verbosity: -1
};

function checkOptions(userOptions){
    let options = userOptions || pdf.Options;
    if (typeof options == 'undefined') options = DEFAULT_OPTIONS;
    if (typeof options.pagerender != 'function') options.pagerender = DEFAULT_OPTIONS.pagerender;
    if (typeof options.max != 'number') options.max = DEFAULT_OPTIONS.max;
    if (typeof options.version != 'string') options.version = DEFAULT_OPTIONS.version;
    if (options.version == 'default') options.version = DEFAULT_OPTIONS.version; 
    if (typeof options.normalizeWhitespace != 'boolean') options.normalizeWhitespace = DEFAULT_OPTIONS.normalizeWhitespace; 
    if (typeof options.disableCombineTextItems != 'boolean') options.disableCombineTextItems = DEFAULT_OPTIONS.disableCombineTextItems;
    if (typeof options.disableWorker != 'boolean') options.disableWorker = DEFAULT_OPTIONS.disableWorker;
    if (typeof options.verbosity != 'number') options.verbosity = DEFAULT_OPTIONS.verbosity;

    //configure pdf.js
    PDFJS = PDFJS ? PDFJS : require(`./pdf.js/${options.version}/build/pdf.js`);

    // Disable workers to avoid yet another cross-origin issue (workers need
    // the URL of the script to be loaded, and dynamically loading a cross-origin script does not work).
    PDFJS.disableWorker = options.disableWorker;
    return options;
}

pdf.info = async function(dataBuffer){
    let options = checkOptions();
    let ret = {};

    let doc = await PDFJS.getDocument(dataBuffer);
    ret.numpages = doc.numPages;
    ret.version = PDFJS.version;

    let metaData = await doc.getMetadata().catch(function(err) {
        //@todo log error
        return "";
    });

    ret.info = metaData ? metaData.info : null;
    ret.metadata = metaData ? metaData.metadata : null;
    await doc.destroy();
    return ret;
};

pdf.custom = async function(dataBuffer,callback){
    let options = checkOptions();
    
    let doc = await PDFJS.getDocument(dataBuffer);
    let numpages = doc.numPages;
    let counter = options.max <= 0 ? numpages : options.max;
    let ret = [];
    for (var i = 1; i <= counter; i++) { 
        let pageData = await doc.getPage(i);
        let pageContent = await pageData.getTextContent(options);
        let result =  callback(pageContent);
        ret.push({page:i,result:result});
    }
    await doc.destroy();
    return ret;
};

pdf.text = async function(dataBuffer){
    let options = checkOptions();
    
    let doc = await PDFJS.getDocument(dataBuffer);
    let numpages = doc.numPages;
    let counter = options.max <= 0 ? numpages : options.max;

    let allPagesText = "";
    for (var i = 1; i <= counter; i++) {
        let pageData = await doc.getPage(i);
        let pageContent = await pageData.getTextContent(options);

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
        allPagesText += currentPageText;
    }
    await doc.destroy();
    return allPagesText;
};


pdf.table = async function(dataBuffer){
    let options = checkOptions();
    
    let doc = await PDFJS.getDocument(dataBuffer);
    let numpages = doc.numPages;

    await doc.destroy();
};

pdf.xml = async function(dataBuffer){
    let options = checkOptions();
    
    let doc = await PDFJS.getDocument(dataBuffer);
    let numpages = doc.numPages;

    await doc.destroy();
};

pdf.json = async function(dataBuffer){
    let options = checkOptions();
    
    let doc = await PDFJS.getDocument(dataBuffer);
    let numpages = doc.numPages;

    await doc.destroy();
};

module.exports = pdf;
