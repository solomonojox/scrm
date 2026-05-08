import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

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
        width: '60%',
    },
    invoiceInfo: {
        width: '35%',
        alignItems: 'flex-end',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
        borderRadius: 40,
    },
    schoolName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 6,
    },
    schoolRegNumber: {
        fontSize: 9,
        color: '#6B7280',
        marginBottom: 8,
    },
    schoolInfo: {
        fontSize: 9,
        color: '#6B7280',
        lineHeight: 1.4,
        marginBottom: 2,
    },
    schoolDetailRow: {
        flexDirection: 'row',
        fontSize: 9,
        color: '#6B7280',
        marginBottom: 2,
    },
    schoolDetailLabel: {
        width: 50,
        fontWeight: 'bold',
    },
    schoolDetailValue: {
        flex: 1,
    },
    invoiceTitle: {
        fontSize: 28,
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
        fontSize: 9,
        color: '#6B7280',
        marginBottom: 2,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 10,
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
        fontSize: 11,
        color: '#6B7280',
    },
    amountValue: {
        fontSize: 11,
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
        paddingVertical: 6,
        borderRadius: 12,
        fontSize: 10,
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
        color: '#6B7280',
        paddingTop: 15,
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
        fontSize: 10,
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
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0369A1',
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 9,
        color: '#1E40AF',
        lineHeight: 1.4,
        marginBottom: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 10,
    },
    termInfo: {
        backgroundColor: '#FEF3C7',
        padding: 12,
        borderRadius: 6,
        marginTop: 15,
        marginBottom: 15,
    },
    termText: {
        fontSize: 10,
        color: '#92400E',
        textAlign: 'center',
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
}

// Enhanced School Info interface with complete school data
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

// Enhanced Student Info interface
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
    formatDate: customFormatDate
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
        return date.toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDate = customFormatDate || formatDateDefault;

    const getStatusColor = (isPaid: boolean) => {
        return isPaid ? '#10B981' : '#EF4444';
    };

    const getStatusBackgroundColor = (isPaid: boolean) => {
        return isPaid ? '#D1FAE5' : '#FEE2E2';
    };

    const getStatusText = (isPaid: boolean) => {
        return isPaid ? 'PAID' : 'UNPAID';
    };

    // Extract term/session info from sessionTermId or use a default
    const getTermDescription = () => {
        // You can enhance this to parse actual term data from your sessionTerm object
        return invoiceData.sessionTermId ? 'School Fees Invoice' : 'School Fees Invoice';
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        {schoolInfo.logo && (
                            <Image
                                style={styles.logo}
                                src={schoolInfo.logo}
                            />
                        )}
                        <Text style={styles.schoolName}>{schoolInfo.name}</Text>
                        {schoolInfo.registrationNumber && schoolInfo.registrationNumber !== 'N/A' && (
                            <Text style={styles.schoolRegNumber}>
                                Reg Number: {schoolInfo.registrationNumber}
                            </Text>
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
                            <Text style={styles.schoolInfo}>
                                Proprietor: {schoolInfo.ownerName}
                            </Text>
                        )}
                    </View>

                    <View style={styles.invoiceInfo}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text style={styles.invoiceNumber}>
                            #{invoiceData.invoiceNumber}
                        </Text>
                        <Text style={styles.invoiceDate}>
                            Date: {formatDate(invoiceData.invoiceDate)}
                        </Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusBackgroundColor(invoiceData.isPaid) }
                        ]}>
                            <Text style={{ color: getStatusColor(invoiceData.isPaid), fontWeight: 'bold' }}>
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
                            <Text style={styles.label}>Student ID</Text>
                            <Text style={styles.value}>{studentInfo.studentId || studentInfo.name}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Registration Number</Text>
                            <Text style={styles.value}>{studentInfo.registrationNumber || studentInfo.name}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Guardian/Parent</Text>
                            <Text style={styles.value}>{studentInfo.guardianName || studentInfo.name}</Text>
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

                {/* Term Information (if available) */}
                <View style={styles.termInfo}>
                    <Text style={styles.termText}>
                        {getTermDescription()} - {invoiceData.sessionTermId}
                    </Text>
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
                                <Text>Unit Price (₦)</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>Amount (₦)</Text>
                            </View>
                        </View>

                        {/* Table Row */}
                        <View style={[styles.tableRow, styles.tableCell]}>
                            <View style={styles.tableCol}>
                                <Text>{getTermDescription()}</Text>
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
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Tax (0%):</Text>
                        <Text style={styles.amountValue}>{formatCurrency(0)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
                        <Text style={styles.totalValue}>{formatCurrency(invoiceData.totalAmount)}</Text>
                    </View>
                </View>

                {/* Payment Instructions */}
                <View style={styles.paymentInstructions}>
                    <Text style={styles.instructionTitle}>💰 Payment Instructions</Text>
                    <Text style={styles.instructionText}>
                        • Invoice Date: {formatDate(invoiceData.invoiceDate)}
                    </Text>
                    <Text style={styles.instructionText}>
                        • Due Date: {formatDate(invoiceData.dueDate)}
                    </Text>
                    <Text style={styles.instructionText}>
                        • Please make payment before the due date to avoid late fees
                    </Text>
                    <Text style={styles.instructionText}>
                        • Payment can be made via bank transfer or at the school's accounts office
                    </Text>
                    {invoiceData.paymentReference && (
                        <Text style={styles.instructionText}>
                            • Payment Reference: {invoiceData.paymentReference}
                        </Text>
                    )}
                    {invoiceData.paymentInstructions && (
                        <Text style={styles.instructionText}>
                            • Instructions: {invoiceData.paymentInstructions}
                        </Text>
                    )}
                    <Text style={[styles.instructionText, { marginTop: 8, fontWeight: 'bold' }]}>
                        ⚠️ Late payment may attract additional charges
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        Thank you for choosing {schoolInfo.name}. For any queries regarding this invoice,
                        please contact the school administration.
                    </Text>
                    <Text style={{ marginTop: 6 }}>
                        {schoolInfo.phone} | {schoolInfo.email}
                    </Text>
        
                    <Text style={{ marginTop: 4, fontSize: 7 }}>
                        Generated on: {formatDate(new Date().toISOString())}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;