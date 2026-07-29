import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register real weight variants instead of a single "light" file mapped to
// every fontWeight used below — the previous registration only had one file,
// so 'bold' / 'medium' styles were silently falling back to the same glyphs.
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 'medium' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    ],
});

const COLORS = {
    accent: '#7C3AED',
    accentSoft: '#F5F3FF',
    ink: '#1F2937',
    subtle: '#6B7280',
    border: '#E5E7EB',
    panel: '#F9FAFB',
    paid: '#10B981',
    paidBg: '#D1FAE5',
    unpaid: '#EF4444',
    unpaidBg: '#FEE2E2',
    overdue: '#B91C1C',
    overdueBg: '#FEE2E2',
    warnBg: '#FEF3C7',
    warnText: '#92400E',
    infoBg: '#F0F9FF',
    infoText: '#1E40AF',
    infoTitle: '#0369A1',
};

// Define styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        paddingBottom: 70,
        fontFamily: 'Roboto',
    },
    watermark: {
        position: 'absolute',
        top: 320,
        left: 100,
        fontSize: 90,
        fontWeight: 'bold',
        color: COLORS.paid,
        opacity: 0.07,
        transform: 'rotate(-30deg)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingBottom: 20,
        borderBottom: `2px solid ${COLORS.panel}`,
    },
    logoSection: {
        flexDirection: 'column',
        width: '60%',
    },
    invoiceInfo: {
        width: '35%',
        alignItems: 'flex-end',
    },
    logo: {
        width: 64,
        height: 64,
        marginBottom: 10,
        borderRadius: 32,
    },
    schoolName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.ink,
        marginBottom: 6,
    },
    schoolRegNumber: {
        fontSize: 8,
        color: COLORS.subtle,
        marginBottom: 8,
    },
    schoolInfo: {
        fontSize: 9,
        color: COLORS.subtle,
        lineHeight: 1.4,
        marginBottom: 2,
    },
    schoolDetailRow: {
        flexDirection: 'row',
        fontSize: 9,
        color: COLORS.subtle,
        marginBottom: 2,
    },
    schoolDetailLabel: {
        width: 50,
        fontWeight: 'medium',
    },
    schoolDetailValue: {
        flex: 1,
    },
    invoiceTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.accent,
        marginBottom: 8,
        letterSpacing: 1,
    },
    invoiceNumber: {
        fontSize: 11,
        color: COLORS.subtle,
        marginBottom: 4,
    },
    invoiceDate: {
        fontSize: 9,
        color: COLORS.subtle,
        marginBottom: 2,
    },
    section: {
        marginBottom: 18,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.ink,
        marginBottom: 10,
        backgroundColor: COLORS.panel,
        padding: 8,
        borderRadius: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    gridItem: {
        width: '50%',
        marginBottom: 6,
    },
    label: {
        fontSize: 8,
        color: COLORS.subtle,
        marginBottom: 2,
        fontWeight: 'medium',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 10,
        color: COLORS.ink,
        fontWeight: 'medium',
    },
    amountSection: {
        backgroundColor: COLORS.panel,
        padding: 15,
        borderRadius: 6,
        marginTop: 16,
        marginBottom: 16,
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    amountLabel: {
        fontSize: 10,
        color: COLORS.subtle,
    },
    amountValue: {
        fontSize: 10,
        color: COLORS.ink,
        fontWeight: 'medium',
    },
    balanceValue: {
        fontSize: 10,
        color: COLORS.unpaid,
        fontWeight: 'bold',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTop: `1px solid ${COLORS.border}`,
    },
    totalLabel: {
        fontSize: 13,
        color: COLORS.ink,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 15,
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    amountInWords: {
        fontSize: 8,
        color: COLORS.subtle,
        fontStyle: 'italic',
        marginTop: 10,
        paddingTop: 8,
        borderTop: `1px dashed ${COLORS.border}`,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        fontSize: 9,
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: COLORS.subtle,
        paddingTop: 12,
        borderTop: `1px solid ${COLORS.border}`,
    },
    pageNumber: {
        position: 'absolute',
        bottom: 30,
        right: 40,
        fontSize: 8,
        color: COLORS.subtle,
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: COLORS.border,
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: COLORS.border,
        padding: 8,
    },
    tableHeader: {
        backgroundColor: COLORS.panel,
        fontSize: 9,
        fontWeight: 'bold',
        color: '#374151',
    },
    tableCell: {
        fontSize: 9,
        color: COLORS.ink,
    },
    paymentInstructions: {
        backgroundColor: COLORS.infoBg,
        padding: 15,
        borderRadius: 6,
        marginTop: 16,
    },
    instructionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.infoTitle,
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 9,
        color: COLORS.infoText,
        lineHeight: 1.4,
        marginBottom: 4,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 10,
    },
    termInfo: {
        backgroundColor: COLORS.warnBg,
        padding: 12,
        borderRadius: 6,
        marginTop: 15,
        marginBottom: 15,
    },
    termText: {
        fontSize: 10,
        color: COLORS.warnText,
        textAlign: 'center',
        fontWeight: 'medium',
    },
});

interface InvoiceData {
    invoiceId: string;
    schoolId: string;
    schoolName?: string | null;
    sessionTermId: string;
    studentCount: number;
    amountPerStudent: number;
    totalAmount: number;
    invoiceDate: string;
    dueDate: string;
    isPaid: boolean;
    paidDate: string | null;
    paymentReference: string | null;
    emailSent: boolean;
    emailSentDate: string;
    invoiceNumber: string;
    paymentInstructions: string | null;
    school: any | null;
    sessionTerm: any | null;
    /** Optional: how much of totalAmount has actually been paid so far.
     *  Defaults to totalAmount when isPaid, otherwise 0. */
    amountPaid?: number | null;
}

interface SchoolInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    registrationNumber?: string;
    ownerName?: string;
    city?: string;
    state?: string;
    typeOfSchool?: string;
    logo?: string;
}

interface StudentInfo {
    name: string;
    guardianName: string;
    classroom: string;
    studentId?: string;
    registrationNumber?: string;
}

interface InvoicePDFProps {
    invoiceData: InvoiceData;
    schoolInfo?: SchoolInfo;
    studentInfo?: StudentInfo;
    formatDate?: (dateString: string) => string;
}

// Basic English number-to-words for Naira amounts, e.g. 9998.00 ->
// "Nine Thousand, Nine Hundred and Ninety-Eight Naira Only".
const numberToWords = (value: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Million', 'Billion'];

    const wholeToWords = (num: number): string => {
        if (num === 0) return '';
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) {
            return `${tens[Math.floor(num / 10)]}${num % 10 ? '-' + ones[num % 10] : ''}`;
        }
        if (num < 1000) {
            return `${ones[Math.floor(num / 100)]} Hundred${num % 100 ? ' and ' + wholeToWords(num % 100) : ''}`;
        }
        for (let i = scales.length - 1; i > 0; i--) {
            const unit = Math.pow(1000, i);
            if (num >= unit) {
                const rest = num % unit;
                return `${wholeToWords(Math.floor(num / unit))} ${scales[i]}${rest ? ', ' + wholeToWords(rest) : ''}`;
            }
        }
        return '';
    };

    if (!Number.isFinite(value) || value < 0) return 'N/A';

    const whole = Math.floor(value);
    const kobo = Math.round((value - whole) * 100);

    const wholeWords = whole === 0 ? 'Zero' : wholeToWords(whole);
    const koboWords = kobo > 0 ? ` and ${wholeToWords(kobo)} Kobo` : '';

    return `${wholeWords} Naira${koboWords} Only`;
};

const InvoicePDF: React.FC<InvoicePDFProps> = ({
    invoiceData,
    schoolInfo = {
        name: 'School Management System',
        address: '123 Education Street, City, State',
        phone: '(123) 456-7890',
        email: 'info@school.edu',
        registrationNumber: 'N/A',
        ownerName: 'N/A',
        city: 'N/A',
        state: 'N/A',
        typeOfSchool: 'N/A',
    },
    studentInfo = {
        name: 'Student Name',
        guardianName: 'Parent/Guardian Name',
        classroom: 'Class Name',
        studentId: 'N/A',
        registrationNumber: 'N/A',
    },
    formatDate: customFormatDate,
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDateDefault = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDate = customFormatDate || formatDateDefault;

    const amountPaid =
        invoiceData.amountPaid ?? (invoiceData.isPaid ? invoiceData.totalAmount : 0);
    const balanceDue = Math.max(invoiceData.totalAmount - amountPaid, 0);

    const dueDateObj = invoiceData.dueDate ? new Date(invoiceData.dueDate) : null;
    const isOverdue =
        !invoiceData.isPaid &&
        !!dueDateObj &&
        !Number.isNaN(dueDateObj.getTime()) &&
        dueDateObj.getTime() < Date.now();

    const status = invoiceData.isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : 'UNPAID';
    const statusColor = invoiceData.isPaid ? COLORS.paid : isOverdue ? COLORS.overdue : COLORS.unpaid;
    const statusBg = invoiceData.isPaid ? COLORS.paidBg : isOverdue ? COLORS.overdueBg : COLORS.unpaidBg;

    const termDescription = 'School Fees Invoice';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {invoiceData.isPaid && (
                    <Text style={styles.watermark} fixed>
                        PAID
                    </Text>
                )}

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        {schoolInfo.logo && <Image style={styles.logo} src={schoolInfo.logo} />}
                        <Text style={styles.schoolName}>{schoolInfo.name}</Text>
                        {schoolInfo.registrationNumber && schoolInfo.registrationNumber !== 'N/A' && (
                            <Text style={styles.schoolRegNumber}>Reg Number: {schoolInfo.registrationNumber}</Text>
                        )}
                        <Text style={styles.schoolInfo}>{schoolInfo.address}</Text>
                        <View style={styles.schoolDetailRow}>
                            <Text style={styles.schoolDetailLabel}>Phone:</Text>
                            <Text style={styles.schoolDetailValue}>{schoolInfo.phone}</Text>
                        </View>
                        <View style={styles.schoolDetailRow}>
                            <Text style={styles.schoolDetailLabel}>Email:</Text>
                            <Text style={styles.schoolDetailValue}>{schoolInfo.email}</Text>
                        </View>
                        {schoolInfo.city && schoolInfo.state && (
                            <Text style={styles.schoolInfo}>
                                {schoolInfo.city}, {schoolInfo.state}
                            </Text>
                        )}
                        {schoolInfo.typeOfSchool && schoolInfo.typeOfSchool !== 'N/A' && (
                            <Text style={styles.schoolInfo}>
                                Type: {schoolInfo.typeOfSchool.charAt(0).toUpperCase() + schoolInfo.typeOfSchool.slice(1)} School
                            </Text>
                        )}
                        {schoolInfo.ownerName && schoolInfo.ownerName !== 'N/A' && (
                            <Text style={styles.schoolInfo}>Proprietor: {schoolInfo.ownerName}</Text>
                        )}
                    </View>

                    <View style={styles.invoiceInfo}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text style={styles.invoiceNumber}>#{invoiceData.invoiceNumber}</Text>
                        <Text style={styles.invoiceDate}>Issued: {formatDate(invoiceData.invoiceDate)}</Text>
                        <Text style={styles.invoiceDate}>Due: {formatDate(invoiceData.dueDate)}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                            <Text style={{ color: statusColor, fontWeight: 'bold' }}>{status}</Text>
                        </View>
                    </View>
                </View>

                {/* Student Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bill To</Text>
                    <View style={styles.grid}>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Student Name</Text>
                            <Text style={styles.value}>{studentInfo.name}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Student ID</Text>
                            <Text style={styles.value}>{studentInfo.studentId || 'N/A'}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Registration Number</Text>
                            <Text style={styles.value}>{studentInfo.registrationNumber || 'N/A'}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Guardian/Parent</Text>
                            <Text style={styles.value}>{studentInfo.guardianName || 'N/A'}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Classroom</Text>
                            <Text style={styles.value}>{studentInfo.classroom}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Invoice ID</Text>
                            <Text style={styles.value}>{invoiceData.invoiceId}</Text>
                        </View>
                    </View>
                </View>

                {/* Term Information */}
                <View style={styles.termInfo}>
                    <Text style={styles.termText}>
                        {termDescription} &ndash; {invoiceData.sessionTermId}
                    </Text>
                </View>

                {/* Invoice Details Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Invoice Details</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <View style={styles.tableCol}>
                                <Text>Description</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>Student Count</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>Unit Price</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>Amount</Text>
                            </View>
                        </View>

                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{termDescription}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{invoiceData.studentCount}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{formatCurrency(invoiceData.amountPerStudent)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{formatCurrency(invoiceData.totalAmount)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Amount Summary */}
                <View style={styles.amountSection}>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Subtotal</Text>
                        <Text style={styles.amountValue}>{formatCurrency(invoiceData.totalAmount)}</Text>
                    </View>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Tax (0%)</Text>
                        <Text style={styles.amountValue}>{formatCurrency(0)}</Text>
                    </View>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Amount Paid</Text>
                        <Text style={styles.amountValue}>{formatCurrency(amountPaid)}</Text>
                    </View>
                    {balanceDue > 0 && (
                        <View style={styles.amountRow}>
                            <Text style={styles.amountLabel}>Balance Due</Text>
                            <Text style={styles.balanceValue}>{formatCurrency(balanceDue)}</Text>
                        </View>
                    )}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                        <Text style={styles.totalValue}>{formatCurrency(invoiceData.totalAmount)}</Text>
                    </View>
                    <Text style={styles.amountInWords}>
                        Amount in words: {numberToWords(invoiceData.totalAmount)}
                    </Text>
                </View>

                {/* Payment Instructions */}
                <View style={styles.paymentInstructions} wrap={false}>
                    <Text style={styles.instructionTitle}>Payment Instructions</Text>
                    <Text style={styles.instructionText}>&bull; Invoice Date: {formatDate(invoiceData.invoiceDate)}</Text>
                    <Text style={styles.instructionText}>&bull; Due Date: {formatDate(invoiceData.dueDate)}</Text>
                    <Text style={styles.instructionText}>
                        &bull; Please make payment before the due date to avoid late fees
                    </Text>
                    <Text style={styles.instructionText}>
                        &bull; Payment can be made via bank transfer or at the school&apos;s accounts office
                    </Text>
                    {invoiceData.paymentReference && (
                        <Text style={styles.instructionText}>&bull; Payment Reference: {invoiceData.paymentReference}</Text>
                    )}
                    {invoiceData.paymentInstructions && (
                        <Text style={styles.instructionText}>&bull; Instructions: {invoiceData.paymentInstructions}</Text>
                    )}
                    <Text style={[styles.instructionText, { marginTop: 8, fontWeight: 'bold' }]}>
                        Late payment may attract additional charges
                    </Text>
                </View>

                {/* Footer (repeats on every page) */}
                <View style={styles.footer} fixed>
                    <Text>
                        Thank you for choosing {schoolInfo.name}. For any queries regarding this invoice, please contact the
                        school administration.
                    </Text>
                    <Text style={{ marginTop: 6 }}>
                        {schoolInfo.phone} | {schoolInfo.email}
                    </Text>
                    <Text style={{ marginTop: 4, fontSize: 7 }}>
                        Generated on: {formatDate(new Date().toISOString())}
                    </Text>
                </View>
                <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                    fixed
                />
            </Page>
        </Document>
    );
};

export default InvoicePDF;