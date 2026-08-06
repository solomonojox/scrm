// InvoicePreviewModal.tsx
//
// The "fancy" invoice preview modal. Pulled out of the page component so the
// animation / skeleton / error-state logic isn't tangled with data fetching.
//
// Rendering strategy: instead of mounting <PDFViewer> directly against a
// document that might throw mid-render (unresolvable glyph, remote font
// fetch failure, etc.), we first build the PDF to a blob via pdf(doc).toBlob(),
// race it against a 10s timeout, and only mount <PDFViewer> once that succeeds.
// This gives us a real try/catch + timeout around generation (the modal's
// "failure state" requirement) while still showing a genuinely live,
// embedded PDFViewer for the body — pdf() and <PDFViewer> render the same
// document tree, so the preview is not a static fallback.

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import { FiX, FiPrinter, FiDownload, FiAlertTriangle } from 'react-icons/fi';
import Skeleton from '@mui/material/Skeleton';
import { toast } from 'react-toastify';
import type { InvoiceStatus } from '../../../utils/invoiceUtils';
import { INVOICE_STATUS_COLORS } from '../../../utils/invoiceUtils';

const GENERATION_TIMEOUT_MS = 10_000;

interface InvoicePreviewModalProps {
  open: boolean;
  onClose: () => void;
  invoiceNumber: string;
  status: InvoiceStatus;
  /** The <InvoicePDF data={...} /> element — same element used for download. */
  document: React.ReactElement;
  fileName: string;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Invoice generation timed out. Please try again.')), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export default function InvoicePreviewModal({
  open,
  onClose,
  invoiceNumber,
  status,
  document: pdfDocument,
  fileName,
}: InvoicePreviewModalProps) {
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false); // drives the scale/fade transition
  const blobUrlRef = useRef<string | null>(null);
  const isMounted = useRef(true);

  const buildPreview = useCallback(async () => {
    if (!isMounted.current) return;
    
    setPhase('loading');
    setErrorMessage('');
    try {
      const blob = await withTimeout(pdf(pdfDocument).toBlob(), GENERATION_TIMEOUT_MS);
      
      if (!isMounted.current) return;
      
      const url = URL.createObjectURL(blob);
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = url;
      setBlobUrl(url);
      setPhase('ready');
    } catch (err) {
      if (!isMounted.current) return;
      
      const message = err instanceof Error ? err.message : 'Could not build the invoice preview.';
      setErrorMessage(message);
      setPhase('error');
      toast.error(message);
    }
  }, [pdfDocument]);

  // Mount / unmount + entrance animation
  useEffect(() => {
    isMounted.current = true;
    
    if (open) {
      setIsVisible(false);
      // next frame so the transition actually runs from the closed state
      const raf = requestAnimationFrame(() => {
        if (isMounted.current) {
          setIsVisible(true);
        }
      });
      buildPreview();
      return () => {
        cancelAnimationFrame(raf);
        isMounted.current = false;
      };
    }
    setIsVisible(false);
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Clean up the blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  // Escape key closes
  useEffect(() => {
    if (!open) return undefined;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleDownload = useCallback(() => {
    if (!blobUrl) {
      toast.error('No invoice to download');
      return;
    }
    
    try {
      const link = window.document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download invoice');
    }
  }, [blobUrl, fileName]);

  const handlePrint = useCallback(() => {
    if (!blobUrl) {
      toast.error('No invoice to print');
      return;
    }
    
    try {
      const printWindow = window.open(blobUrl, '_blank');
      if (!printWindow) {
        toast.error('Pop-up blocked — allow pop-ups to print the invoice.');
        return;
      }
      
      // Wait for the window to load then trigger print
      printWindow.addEventListener('load', () => {
        try {
          printWindow.print();
        } catch (err) {
          console.warn('Print triggered but may not work in all browsers:', err);
          // User can still print manually
        }
      });
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to open print dialog');
    }
  }, [blobUrl]);

  if (!open) return null;

  const statusColors = INVOICE_STATUS_COLORS[status];

  const modal = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Invoice ${invoiceNumber} preview`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative flex w-full sm:max-w-3xl h-full sm:h-[88vh] sm:rounded-3xl bg-white shadow-2xl
          flex-col overflow-hidden transition-all duration-200 ease-out
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        style={{ minHeight: 0 }}
      >
        {/* Header */}
        <div className="relative flex shrink-0 items-center justify-between gap-4 bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-orange-100">Invoice</p>
            <div className="mt-0.5 flex items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-white">{invoiceNumber}</h2>
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
              >
                {status}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white
              transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto bg-gray-100" style={{ minHeight: 0 }}>
          {phase === 'loading' && <InvoiceSkeleton />}

          {phase === 'error' && (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <FiAlertTriangle size={22} />
              </div>
              <p className="font-medium text-gray-800">Couldn't build the invoice preview</p>
              <p className="max-w-sm text-sm text-gray-500">{errorMessage}</p>
              <button
                type="button"
                onClick={buildPreview}
                className="mt-2 rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white
                  transition-colors hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                Try again
              </button>
            </div>
          )}

          {phase === 'ready' && blobUrl && (
            <div className="h-full w-full" style={{ minHeight: 0 }}>
              <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: 'none', minHeight: 0 }}>
                {pdfDocument}
              </PDFViewer>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
          <button
            type="button"
            onClick={handlePrint}
            disabled={phase !== 'ready'}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium
              text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiPrinter size={14} />
            Print
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={phase !== 'ready'}
            className="flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white
              transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiDownload size={14} />
            Download
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, window.document.body);
}

function InvoiceSkeleton() {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col gap-6 p-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" width={160} height={28} />
          <Skeleton variant="text" width={200} height={14} />
          <Skeleton variant="text" width={180} height={14} />
        </div>
        <div className="space-y-2 text-right">
          <Skeleton variant="text" width={90} height={24} sx={{ marginLeft: 'auto' }} />
          <Skeleton variant="rounded" width={70} height={20} sx={{ marginLeft: 'auto' }} />
        </div>
      </div>
      <Skeleton variant="rounded" height={1} />
      <div className="space-y-2">
        <Skeleton variant="text" width={100} height={16} />
        <Skeleton variant="text" width="70%" height={14} />
        <Skeleton variant="text" width="60%" height={14} />
        <Skeleton variant="text" width="50%" height={14} />
      </div>
      <Skeleton variant="rounded" height={140} />
      <div className="ml-auto w-56 space-y-2">
        <Skeleton variant="text" height={14} />
        <Skeleton variant="text" height={14} />
        <Skeleton variant="text" height={20} />
      </div>
    </div>
  );
}