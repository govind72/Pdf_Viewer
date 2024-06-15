import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { Button, Modal, Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CloseIcon from '@mui/icons-material/Close';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function PdfViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    // setFile(null);
    setNumPages(null);
    setPageNumber(1);
    setScale(1.0);
  };

  const handleZoomIn = () => {
    setScale(prevScale => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const modalStyle = {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: '50%',
    maxHeight: '80vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 600px)': {
      width: '90%',
      top: '5%',
      maxHeight: '90vh',
    },
  };

  const documentContainerStyle = {
    flexGrow: 1,
    overflow: 'auto',
    textAlign: 'center',
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: 2,
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  };

  const buttonGroupStyle = {
    display: 'flex',
    '@media (max-width: 600px)': {
      width: '100%',
      justifyContent: 'space-between',
    },
  };

  return (
    <>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: 'block', marginBottom: '16px' }}
      />
      <Button variant="contained" color="primary" onClick={handleOpenModal} disabled={!file}>
        View PDF
      </Button>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton
            onClick={handleCloseModal}
            style={{ alignSelf: 'flex-end' }}
          >
            <CloseIcon />
          </IconButton>
          {file && (
            <Box sx={documentContainerStyle}>
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} renderTextLayer={false} scale={scale} />
              </Document>
            </Box>
          )}
          <Box sx={footerStyle}>
            <Box sx={buttonGroupStyle}>
              <Button
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
                variant="contained"
                color="secondary"
                startIcon={<ArrowBackIcon />}
                sx={{ mr: 1 }}
              >
                Previous
              </Button>
              <Button
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            </Box>
            <Typography>
              Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
            </Typography>
            <Box>
              <IconButton onClick={handleZoomOut} color="primary">
                <ZoomOutIcon />
              </IconButton>
              <IconButton onClick={handleZoomIn} color="primary">
                <ZoomInIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
