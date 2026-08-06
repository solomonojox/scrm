// InvoicePDF.tsx - Updated amount handling

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { GeneratedInvoiceData } from '../../../Types/Admin/InvoiceRecordType';
import {
  formatCurrencyPlain,
  amountToWords,
  deriveInvoiceStatusFromPaid,
  INVOICE_STATUS_COLORS,
  type InvoiceStatus,
} from '../../../utils/invoiceUtils';

export interface SchoolInfoForPDF {
  name: string;
  address: string;
  phone: string;
  email: string;
  registrationNumber: string;
  ownerName: string;
  city: string;
  state: string;
  typeOfSchool: string;
}

export interface StudentInfoForPDF {
  name: string;
  guardianName: string;
  classroom: string;
  studentId: string;
  registrationNumber: string;
}

interface InvoicePDFProps {
  invoiceData: GeneratedInvoiceData;
  schoolInfo: SchoolInfoForPDF;
  studentInfo: StudentInfoForPDF;
  formatDate: (dateString: string) => string;
}

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1f2937',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  schoolName: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#c2410c',
    marginBottom: 3,
  },
  schoolMeta: {
    fontSize: 8,
    color: '#6b7280',
    lineHeight: 1.5,
  },
  invoiceMetaBlock: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  metaLine: {
    fontSize: 8,
    color: '#4b5563',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3d5b5',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#c2410c',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  billToBlock: {
    marginBottom: 16,
  },
  billToRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  billToLabel: {
    width: 90,
    color: '#6b7280',
  },
  billToValue: {
    flex: 1,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  table: {
    marginBottom: 12,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#fff7ed',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  colDescription: { flex: 3 },
  colQty: { flex: 1, textAlign: 'center' },
  colUnit: { flex: 1.5, textAlign: 'right' },
  colTotal: { flex: 1.5, textAlign: 'right' },
  tableHeaderText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: '#9a3412',
  },
  summaryBlock: {
    alignSelf: 'flex-end',
    width: 220,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: {
    color: '#6b7280',
  },
  summaryValue: {
    fontFamily: 'Helvetica-Bold',
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  summaryTotalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#111827',
  },
  summaryTotalValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#c2410c',
  },
  wordsBlock: {
    marginTop: 14,
    padding: 8,
    backgroundColor: '#fff7ed',
    borderRadius: 4,
  },
  wordsLabel: {
    fontSize: 7,
    color: '#9a3412',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  wordsValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#374151',
  },
  instructionsBlock: {
    marginTop: 16,
  },
  instructionsText: {
    fontSize: 8,
    color: '#4b5563',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    textAlign: 'center',
    fontSize: 7,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
});

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const colors = INVOICE_STATUS_COLORS[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
      <Text style={{ color: colors.text }}>{status}</Text>
    </View>
  );
}

export default function InvoicePDF({ invoiceData, schoolInfo, studentInfo, formatDate }: InvoicePDFProps) {
  const status = deriveInvoiceStatusFromPaid(invoiceData.isPaid, invoiceData.dueDate);

  // CRITICAL FIX: Use the amountPerStudent from invoiceData (which now has the correct payment amount)
  const unitAmount = invoiceData.amountPerStudent ?? invoiceData.totalAmount ?? 0;
  const total = invoiceData.totalAmount ?? unitAmount;
  const amountPaid = invoiceData.isPaid ? total : 0;
  const balanceDue = Math.max(total - amountPaid, 0);

  // Get session term name
  let sessionTermName = 'School Fees';
  if (invoiceData.sessionTerm) {
    const term = invoiceData.sessionTerm as any;
    sessionTermName = term.term || term.name || term.sessionTermName || 'School Fees';
  }
  
  const lineDescription = sessionTermName ? `${sessionTermName} Fees` : 'School Fees';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.schoolName}>{schoolInfo.name}</Text>
            <Text style={styles.schoolMeta}>{schoolInfo.address}</Text>
            <Text style={styles.schoolMeta}>{schoolInfo.phone} · {schoolInfo.email}</Text>
            <Text style={styles.schoolMeta}>Reg. No: {schoolInfo.registrationNumber}</Text>
          </View>
          <View style={styles.invoiceMetaBlock}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <StatusBadge status={status} />
            <Text style={styles.metaLine}>No: {invoiceData.invoiceNumber}</Text>
            <Text style={styles.metaLine}>Date: {formatDate(invoiceData.invoiceDate)}</Text>
            <Text style={styles.metaLine}>Due: {formatDate(invoiceData.dueDate)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bill To */}
        <View style={styles.billToBlock}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <View style={styles.billToRow}>
            <Text style={styles.billToLabel}>Student</Text>
            <Text style={styles.billToValue}>{studentInfo.name}</Text>
          </View>
          {/* <View style={styles.billToRow}>
            <Text style={styles.billToLabel}>Guardian</Text>
            <Text style={styles.billToValue}>{studentInfo.guardianName}</Text>
          </View> */}
          <View style={styles.billToRow}>
            <Text style={styles.billToLabel}>Class</Text>
            <Text style={styles.billToValue}>{studentInfo.classroom}</Text>
          </View>
          <View style={styles.billToRow}>
            <Text style={styles.billToLabel}>Student ID</Text>
            <Text style={styles.billToValue}>{studentInfo.studentId}</Text>
          </View>
          {studentInfo.registrationNumber && studentInfo.registrationNumber !== 'N/A' && (
            <View style={styles.billToRow}>
              <Text style={styles.billToLabel}>Reg. No</Text>
              <Text style={styles.billToValue}>{studentInfo.registrationNumber}</Text>
            </View>
          )}
        </View>

        {/* Line items - Showing the actual payment amount */}
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colDescription, styles.tableHeaderText]}>Description</Text>
            <Text style={[styles.colQty, styles.tableHeaderText]}>Qty</Text>
            <Text style={[styles.colUnit, styles.tableHeaderText]}>Unit Amount</Text>
            <Text style={[styles.colTotal, styles.tableHeaderText]}>Total</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colDescription}>{lineDescription}</Text>
            <Text style={styles.colQty}>1</Text>
            <Text style={styles.colUnit}>{formatCurrencyPlain(unitAmount)}</Text>
            <Text style={styles.colTotal}>{formatCurrencyPlain(unitAmount)}</Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrencyPlain(total)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount Paid</Text>
            <Text style={styles.summaryValue}>{formatCurrencyPlain(amountPaid)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Balance Due</Text>
            <Text style={styles.summaryValue}>{formatCurrencyPlain(balanceDue)}</Text>
          </View>
          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{formatCurrencyPlain(total)}</Text>
          </View>
        </View>

        {/* Amount in words */}
        <View style={styles.wordsBlock}>
          <Text style={styles.wordsLabel}>Amount in words</Text>
          <Text style={styles.wordsValue}>{amountToWords(total)}</Text>
        </View>

        {/* Payment instructions */}
        {invoiceData.paymentInstructions && (
          <View style={styles.instructionsBlock}>
            <Text style={styles.sectionTitle}>Payment Instructions</Text>
            <Text style={styles.instructionsText}>{invoiceData.paymentInstructions}</Text>
          </View>
        )}

        <Text style={styles.footer} fixed>
          {schoolInfo.name} · This is a system-generated invoice
        </Text>
      </Page>
    </Document>
  );
}