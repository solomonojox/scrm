import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register fonts if needed
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
});

// Define styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Roboto',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: '2px solid #F3F4F6',
    },
    logoSection: {
        flexDirection: 'column',
        width: '50%',
    },
    invoiceInfo: {
        width: '40%',
        alignItems: 'flex-end',
    },
    logo: {
        width: 120,
        height: 40,
        marginBottom: 10,
    },
    schoolName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    schoolInfo: {
        fontSize: 10,
        color: '#6B7280',
        lineHeight: 1.4,
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7C3AED',
        marginBottom: 8,
    },
    invoiceNumber: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    invoiceDate: {
        fontSize: 10,
        color: '#6B7280',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 10,
        backgroundColor: '#F9FAFB',
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
        fontSize: 10,
        color: '#6B7280',
        marginBottom: 2,
    },
    value: {
        fontSize: 11,
        color: '#1F2937',
        fontWeight: 'medium',
    },
    amountSection: {
        backgroundColor: '#F9FAFB',
        padding: 15,
        borderRadius: 6,
        marginTop: 20,
        marginBottom: 30,
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    amountLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    amountValue: {
        fontSize: 12,
        color: '#1F2937',
        fontWeight: 'medium',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTop: '1px solid #E5E7EB',
    },
    totalLabel: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 16,
        color: '#7C3AED',
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 10,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 10,
        color: '#6B7280',
        paddingTop: 20,
        borderTop: '1px solid #E5E7EB',
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#E5E7EB',
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
        borderColor: '#E5E7EB',
        padding: 8,
    },
    tableHeader: {
        backgroundColor: '#F9FAFB',
        fontSize: 11,
        fontWeight: 'bold',
        color: '#374151',
    },
    tableCell: {
        fontSize: 10,
        color: '#1F2937',
    },
    paymentInstructions: {
        backgroundColor: '#F0F9FF',
        padding: 15,
        borderRadius: 6,
        marginTop: 20,
    },
    instructionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0369A1',
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 10,
        color: '#1E40AF',
        lineHeight: 1.4,
    },
});

interface InvoiceData {
    invoiceId: string;
    schoolId: string;
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
    school: any | null;
    sessionTerm: any | null;
}

interface InvoicePDFProps {
    invoiceData: InvoiceData;
    schoolInfo?: {
        name: string;
        address: string;
        phone: string;
        email: string;
        logo?: string;
    };
    studentInfo?: {
        name: string;
        guardianName: string;
        classroom: string;
    };
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({
    invoiceData,
    schoolInfo = {
        name: 'School Management System',
        address: '123 Education Street, City, State',
        phone: '(123) 456-7890',
        email: 'info@school.edu',
    },
    studentInfo = {
        name: 'Student Name',
        guardianName: 'Parent/Guardian Name',
        classroom: 'Class Name',
    }
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMMM dd, yyyy');
    };

    const getStatusColor = (isPaid: boolean) => {
        return isPaid ? '#10B981' : '#EF4444'; // Green for paid, red for unpaid
    };

    const getStatusText = (isPaid: boolean) => {
        return isPaid ? 'PAID' : 'UNPAID';
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        {/* School Logo */}
                        <Image
                            style={styles.logo}
                            src="/logo.png" // Replace with actual logo path
                        />
                        <Text style={styles.schoolName}>{schoolInfo.name}</Text>
                        <Text style={styles.schoolInfo}>
                            {schoolInfo.address}
                        </Text>
                        <Text style={styles.schoolInfo}>
                            Phone: {schoolInfo.phone} | Email: {schoolInfo.email}
                        </Text>
                    </View>

                    <View style={styles.invoiceInfo}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text style={styles.invoiceNumber}>
                            Invoice #: {invoiceData.invoiceNumber}
                        </Text>
                        <Text style={styles.invoiceDate}>
                            Date: {formatDate(invoiceData.invoiceDate)}
                        </Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(invoiceData.isPaid) + '20' }
                        ]}>
                            <Text style={{ color: getStatusColor(invoiceData.isPaid) }}>
                                {getStatusText(invoiceData.isPaid)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Student Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Student Information</Text>
                    <View style={styles.grid}>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Student Name</Text>
                            <Text style={styles.value}>{studentInfo.name}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Guardian/Parent</Text>
                            <Text style={styles.value}>{studentInfo.guardianName}</Text>
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

                {/* Invoice Details Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Invoice Details</Text>
                    <View style={styles.table}>
                        {/* Table Header */}
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

                        {/* Table Row */}
                        <View style={[styles.tableRow, styles.tableCell]}>
                            <View style={styles.tableCol}>
                                <Text>School Fees - {invoiceData.sessionTermId}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{invoiceData.studentCount}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{formatCurrency(invoiceData.amountPerStudent)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{formatCurrency(invoiceData.totalAmount)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Amount Summary */}
                <View style={styles.amountSection}>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Subtotal:</Text>
                        <Text style={styles.amountValue}>{formatCurrency(invoiceData.totalAmount)}</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
                        <Text style={styles.totalValue}>{formatCurrency(invoiceData.totalAmount)}</Text>
                    </View>
                </View>

                {/* Payment Instructions */}
                <View style={styles.paymentInstructions}>
                    <Text style={styles.instructionTitle}>Payment Instructions</Text>
                    <Text style={styles.instructionText}>
                        • Invoice Date: {formatDate(invoiceData.invoiceDate)}
                    </Text>
                    <Text style={styles.instructionText}>
                        • Due Date: {formatDate(invoiceData.dueDate)}
                    </Text>
                    <Text style={styles.instructionText}>
                        • Please make payment before the due date to avoid penalties
                    </Text>
                    <Text style={styles.instructionText}>
                        • Payment can be made via bank transfer or at the school's accounts office
                    </Text>
                    {invoiceData.paymentReference && (
                        <Text style={styles.instructionText}>
                            • Payment Reference: {invoiceData.paymentReference}
                        </Text>
                    )}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        Thank you for choosing {schoolInfo.name}. For any queries regarding this invoice,
                        please contact the school administration.
                    </Text>
                    <Text style={{ marginTop: 8 }}>
                        This is a computer-generated invoice. No signature required.
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;