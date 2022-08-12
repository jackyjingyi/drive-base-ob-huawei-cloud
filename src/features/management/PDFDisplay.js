import {read, writeFileXLSX} from "xlsx";
import * as XLSX from 'xlsx';
import {useEffect, useState} from "react";
import {Button} from "antd";
import {Document, Page, pdfjs} from 'react-pdf'
import cookie from "react-cookies";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
function PDFDisplay(props) {
    const [file, setFile] = useState({
        id: "",
        key: "",
        name: "",
        code: "",
        file: null,
        file_url: null
    })
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
    }

    useEffect(() => {
        let ignore = false

        async function get_excel() {
            const req = await axios({
                method: 'get',
                url: `/api/core/management/${props.fileID}`
            })
            const data = req.data
            console.log(data)
            if (!ignore) {
                setFile(data)
            }
        }

        if (!file.file) {
            get_excel()
        }

        return () => {
            ignore = true
        }
    }, [])


    return (
        <div>
            <Document file={"https://materials-bay.octiri.com/projects/test1.pdf"} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber}/>
            </Document>
            <p>
                Page {pageNumber} of {numPages}
            </p>
        </div>
    )

}

export default PDFDisplay;



