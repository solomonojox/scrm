import React, { useState } from 'react';
import {
    Shield,
    Lock,
    Users,
    Database,
    Globe,
    Mail,
    Bell,
    CreditCard,
    FileText,
    Share2,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import imageAssets from '../assets/imageAssets';
import { FaBars, FaTimes } from 'react-icons/fa';

const { logo } = imageAssets

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/">
                        <img src={logo} alt="EduCat logo" width={96} height={44} className="object-contain" />
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center space-x-8 font-semibold text-gray-800 text-sm">
                        {[
                            { name: "Home", link: "/" },
                            { name: "About Us", link: "#about" },
                            { name: "Features", link: "#features" },
                            { name: "Statistics", link: "#statistics" },
                            { name: "Contact", link: "#contact" },
                        ].map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.link}
                                    className="hover:text-orange-600 transition-colors duration-200"
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Login Button (Desktop) */}
                    <div className="hidden md:flex items-center space-x-2">
                        <button
                            className="bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-orange-800 transition-colors duration-200"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                        <button
                            className="bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-orange-800 transition-colors duration-200"
                            onClick={() => navigate("/cbt/login")}
                        >
                            CBT Exam
                        </button>
                        <button
                            className="bg-purple-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-purple-800 transition-colors duration-200"
                            onClick={() => navigate("/napps/login")}
                        >
                            NAPPS
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-800 hover:text-orange-600 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <FaTimes className="text-2xl" />
                            ) : (
                                <FaBars className="text-2xl" />
                            )}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Hero Section */}
            <div className="bg-linear-to-r from-orange-600 to-orange-500 text-white">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-10 h-10" />
                            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
                        </div>
                        <p className="text-xl text-orange-100 mb-4">EducatMobile</p>
                        <div className="flex flex-wrap gap-4 text-sm text-orange-100">
                            <span>Author: Manus AI</span>
                            <span>•</span>
                            <span>Effective Date: May 5, 2026</span>
                            <span>•</span>
                            <span>Last Updated: May 5, 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Introduction Card */}
                    <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                    <FileText className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        Welcome to <span className="font-semibold text-orange-600">EducatMobile</span> ("we," "our," or "us").
                                        We are committed to protecting your privacy and providing a safe educational management platform
                                        for schools, teachers, guardians, and students.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed mt-3">
                                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                                        when you use our mobile application EducatMobile ("the App").
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information We Collect */}
                    <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Database className="w-6 h-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-orange-600" />
                                        2.1 Personal Information
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li><span className="font-medium">School Information:</span> School registration number, school name, address</li>
                                        <li><span className="font-medium">User Information:</span> Name, email address, phone number, role (Admin, Teacher, Guardian)</li>
                                        <li><span className="font-medium">Student Information:</span> Student names, admission numbers, class assignments, academic records</li>
                                        <li><span className="font-medium">Guardian Information:</span> Parent/guardian names, contact details, relationship to students</li>
                                        <li><span className="font-medium">Teacher Information:</span> Employment details, class assignments, subject specializations</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-orange-600" />
                                        2.2 Usage Data
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Device information (model, OS version, unique device identifiers)</li>
                                        <li>App usage statistics and interactions</li>
                                        <li>Login history and timestamps</li>
                                        <li>IP addresses</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-orange-600" />
                                        2.3 Communication Data
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>Messages sent between users (teachers, guardians, admins)</li>
                                        <li>Push notification preferences</li>
                                        <li>Email correspondence with support</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-orange-600" />
                                        2.4 Financial Information
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                        <li>School fee payment records</li>
                                        <li>Transaction histories</li>
                                        <li>Wallet balances (processed through secure payment gateways)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How We Use Your Information */}
                    <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                    <CheckCircle className="w-6 h-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    "Provide, operate, and maintain the App",
                                    "Authenticate users and manage access",
                                    "Facilitate communication between teachers, guardians, and administrators",
                                    "Track student attendance, assignments, and academic performance",
                                    "Process school fee payments",
                                    "Send push notifications about messages and updates",
                                    "Improve and personalize user experience",
                                    "Comply with legal obligations",
                                    "Detect and prevent fraud or security issues"
                                ].map((use, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                                        <span className="text-gray-700">{use}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Data Sharing */}
                    <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Share2 className="w-6 h-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">4. Data Sharing and Disclosure</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">4.1 Within the School System</h3>
                                    <p className="text-gray-700 mb-3">Data is shared only among authorized users within the same school:</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                        <li>Teachers can view student information of their assigned classes</li>
                                        <li>Guardians can view their children's academic information</li>
                                        <li>Admins have access to all school data</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">4.2 Third-Party Service Providers</h3>
                                    <p className="text-gray-700 mb-3">We may share data with:</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                        <li>Firebase (push notifications, analytics)</li>
                                        <li>Payment processors (for fee payments)</li>
                                        <li>Cloud hosting providers</li>
                                        <li>Email service providers</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">4.3 Legal Requirements</h3>
                                    <p className="text-gray-700">We may disclose information if required by law or to protect our rights.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Lock className="w-6 h-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">5. Data Security</h2>
                            </div>

                            <p className="text-gray-700 mb-4">We implement industry-standard security measures:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {[
                                    "Encrypted data transmission (SSL/TLS)",
                                    "Secure authentication tokens",
                                    "Regular security updates",
                                    "Access controls based on user roles",
                                    "Data encryption at rest"
                                ].map((measure, idx) => (
                                    <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                        <span className="text-green-700 text-sm font-medium">{measure}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                <p className="text-yellow-800 text-sm">⚠️ However, no method of transmission over the internet is 100% secure.</p>
                            </div>
                        </div>
                    </div>

                    {/* Data Retention & Children's Privacy */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Database className="w-6 h-6 text-orange-600" />
                                    <h2 className="text-xl font-bold text-gray-900">6. Data Retention</h2>
                                </div>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>As long as your school maintains an active account</li>
                                    <li>Student records are retained as required by educational regulations</li>
                                    <li>You may request deletion of your data by contacting your school administrator</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Users className="w-6 h-6 text-orange-600" />
                                    <h2 className="text-xl font-bold text-gray-900">7. Children's Privacy</h2>
                                </div>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Student data is collected only with school authorization</li>
                                    <li>Parents/Guardians have access to their children's information</li>
                                    <li>We do not knowingly collect personal information from children without parental consent</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Your Rights */}
                    <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Shield className="w-6 h-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">8. Your Rights</h2>
                            </div>

                            <p className="text-gray-700 mb-4">Depending on your location, you may have the right to:</p>
                            <div className="grid sm:grid-cols-2 gap-3 mb-4">
                                {[
                                    "Access your personal information",
                                    "Correct inaccurate data",
                                    "Request deletion of your data",
                                    "Opt-out of marketing communications",
                                    "Data portability"
                                ].map((right, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-gray-700">{right}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700">
                                    To exercise these rights, contact your school administrator or email us at:{" "}
                                    <a href="mailto:support@codeweb.com.ng" className="text-orange-600 font-medium hover:underline">
                                        support@codeweb.com.ng
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Sections */}
                    <div className="space-y-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-orange-600" />
                                9. International Data Transfers
                            </h2>
                            <p className="text-gray-700">Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place.</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-orange-600" />
                                10. Changes to This Privacy Policy
                            </h2>
                            <p className="text-gray-700 mb-3">We may update this policy from time to time. We will notify you of any changes by:</p>
                            <ul className="list-disc list-inside text-gray-700 ml-4">
                                <li>Posting the new policy in the App</li>
                                <li>Sending a notification to registered users</li>
                            </ul>
                            <p className="text-gray-700 mt-3">Continued use of the App after changes constitutes acceptance of the updated policy.</p>
                        </div>
                    </div>

                    {/* Contact & Consent */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-linear-to-br from-orange-50 to-white rounded-2xl shadow-xl p-6 border border-orange-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-orange-600" />
                                11. Contact Us
                            </h2>
                            <div className="space-y-2 text-gray-700">
                                <p>Email: <a href="mailto:support@codeweb.com.ng" className="text-orange-600 hover:underline">support@codeweb.com.ng</a></p>
                                <p>Website: <a href="https://codeweb.com.ng" className="text-orange-600 hover:underline">https://codeweb.com.ng</a></p>
                                <p>Address: Ikorodu, Lagos</p>
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-orange-50 to-white rounded-2xl shadow-xl p-6 border border-orange-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-orange-600" />
                                12. School Data Ownership
                            </h2>
                            <p className="text-gray-700">Schools retain ownership of their data. EducatMobile acts as a data processor for school information.</p>
                        </div>
                    </div>

                    {/* Consent Banner */}
                    <div className="bg-orange-600 rounded-2xl shadow-xl p-8 text-white">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-8 h-8 shrink-0" />
                            <div>
                                <h2 className="text-2xl font-bold mb-3">Consent</h2>
                                <p className="text-orange-100 mb-4">
                                    By using EducatMobile, you consent to this Privacy Policy and our collection and use of your information as described herein.
                                </p>
                                <div className="bg-orange-700 rounded-lg p-4 mt-4">
                                    <p className="text-orange-100 text-sm">
                                        <span className="font-semibold">For School Administrators:</span> Please ensure you have appropriate consent from parents/guardians before adding student information to the system.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        <p>© 2026 EducatMobile. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;