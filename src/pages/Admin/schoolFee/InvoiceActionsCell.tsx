// InvoiceActionsCell.tsx
//
// The three small circular icon-button row actions for one payment row:
// generate/regenerate, download, preview. Matches the real call site in
// InvoiceRecordsPage: <InvoiceActionsCell payment generatedInvoice
// isGenerating schoolInfo formatDate onGenerate onPreview />.
//
// Download is handled entirely in here — it rebuilds the same InvoicePDF
// element used for preview via pdf(...).toBlob() and triggers a save, so
// there's no separate "download" state to thread back up to the page.

import React, { useCallback, useState } from 'react';
import { FiRefreshCw, FiDownload, FiEye } from 'react-icons/fi';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { pdf } from '@react-pdf/renderer';
import { toast } from 'react-toastify';
import { GeneratedInvoiceData, PaymentRecordType } from '../../../Types/Admin/InvoiceRecordType';
import InvoicePDF, { type SchoolInfoForPDF, type StudentInfoForPDF } from './InvoicePDF';

interface InvoiceActionsCellProps {
  payment: PaymentRecordType;
  generatedInvoice: GeneratedInvoiceData | undefined;
  isGenerating: boolean;
  schoolInfo: SchoolInfoForPDF;
  formatDate: (dateString: string) => string;
  onGenerate: (payment: PaymentRecordType) => void;
  onPreview: (payment: PaymentRecordType) => void;
}

const baseIconBtn =
  'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 ' +
  'disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

function buildStudentInfo(payment: PaymentRecordType): StudentInfoForPDF {
  return {
    name: payment.studentName,
    guardianName: 'N/A',
    classroom: payment.className,
    studentId: payment.studentId,
    registrationNumber: 'N/A',
  };
}

export default function InvoiceActionsCell({
  payment,
  generatedInvoice,
  isGenerating,
  schoolInfo,
  formatDate,
  onGenerate,
  onPreview,
}: InvoiceActionsCellProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const hasInvoice = Boolean(generatedInvoice?.invoiceId);

  const handleDownload = useCallback(async () => {
    if (!generatedInvoice) {
      toast.error('No invoice to download. Please generate one first.');
      return;
    }
    
    setIsDownloading(true);
    try {
      const blob = await pdf(
        <InvoicePDF
          invoiceData={generatedInvoice}
          schoolInfo={schoolInfo}
          studentInfo={buildStudentInfo(payment)}
          formatDate={formatDate}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${generatedInvoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL after download
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Could not download the invoice PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [generatedInvoice, schoolInfo, payment, formatDate]);

  return (
    <div className="flex items-center gap-2">
      <Tooltip title={hasInvoice ? 'Regenerate invoice' : 'Generate invoice'}>
        <span>
          <button
            type="button"
            onClick={() => onGenerate(payment)}
            disabled={isGenerating}
            aria-label={hasInvoice ? 'Regenerate invoice' : 'Generate invoice'}
            className={`${baseIconBtn} bg-orange-50 text-orange-600 hover:bg-orange-100 focus-visible:ring-orange-400`}
          >
            {isGenerating ? (
              <CircularProgress size={14} thickness={5} sx={{ color: 'inherit' }} />
            ) : (
              <FiRefreshCw size={14} />
            )}
          </button>
        </span>
      </Tooltip>

      <Tooltip title={hasInvoice ? 'Download PDF' : 'Generate the invoice first'}>
        <span>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!hasInvoice || isDownloading}
            aria-label="Download invoice PDF"
            className={`${baseIconBtn} bg-blue-50 text-blue-600 hover:bg-blue-100 focus-visible:ring-blue-400`}
          >
            {isDownloading ? (
              <CircularProgress size={14} thickness={5} sx={{ color: 'inherit' }} />
            ) : (
              <FiDownload size={14} />
            )}
          </button>
        </span>
      </Tooltip>

      <Tooltip title={hasInvoice ? 'Preview invoice' : 'Generate the invoice first'}>
        <span>
          <button
            type="button"
            onClick={() => onPreview(payment)}
            disabled={!hasInvoice}
            aria-label="Preview invoice"
            className={`${baseIconBtn} bg-green-50 text-green-600 hover:bg-green-100 focus-visible:ring-green-400`}
          >
            <FiEye size={14} />
          </button>
        </span>
      </Tooltip>
    </div>
  );
}