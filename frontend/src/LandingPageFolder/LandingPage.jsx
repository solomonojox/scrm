import React from 'react';

const LandingPage = () => {
    return (
        <div className="font-sans text-gray-800">

            <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex-shgray-0 flex items-center">
                            <span className="text-2xl font-bold text-gray-600">SCRM</span>
                        </div>
                        <div className=" sm:ml-1 sm:flex sm:space-x-8 items-center py-4">
                            <a href="#hero" className="text-gray-700 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                            <a href="#about" className="text-gray-700 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
                            <a href="#why" className="text-gray-700 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Why Choose Us</a>
                            <a href="#stats" className="text-gray-700 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Statistics</a>
                            <a href="#contact" className="text-gray-700 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="pt-20">

                <section id="hero" className="bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-600">
                            Welcome to School Management SCRM
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Simplifying school operations, empowering educators, and engaging students.
                        </p>
                        <div className="mt-8">
                            <a href="#contact" className="inline-block bg-gray-600 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-gray-700">
                                Get Started
                            </a>
                        </div>
                    </div>
                </section>

                <section id="about" className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 py-20">
                        <h2 className="text-3xl font-bold text-gray-600 text-center">About SCRM</h2>
                        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
                            SCRM is a comprehensive school management solution designed to streamline administrative tasks, enhance communication between teachers, students, and parents, and provide data-driven insights for better decision-making.
                        </p>
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 border rounded-lg hover:shadow-lg transition">
                                <h3 className="text-xl font-semibold text-gray-600">Effortless Administration</h3>
                                <p className="mt-2 text-gray-600">
                                    Manage schedules, attendance, and grading all in one place.
                                </p>
                            </div>
                            <div className="p-6 border rounded-lg hover:shadow-lg transition">
                                <h3 className="text-xl font-semibold text-gray-600">Engaging Communication</h3>
                                <p className="mt-2 text-gray-600">
                                    Seamless messaging between teachers, students, and parents.
                                </p>
                            </div>
                            <div className="p-6 border rounded-lg hover:shadow-lg transition">
                                <h3 className="text-xl font-semibold text-gray-600">Data-Driven Insights</h3>
                                <p className="mt-2 text-gray-600">
                                    Analytics to track performance and identify areas for improvement.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


                <section id="why" className="bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 py-20">
                        <h2 className="text-3xl font-bold text-gray-600 text-center">Why Choose SCRM?</h2>
                        <ul className="mt-8 space-y-6 max-w-3xl mx-auto text-gray-600 list-disc list-inside">
                            <li><strong>User-Friendly Interface:</strong> Intuitive design ensures quick adoption by staff and students.</li>
                            <li><strong>Secure & Reliable:</strong> State-of-the-art security measures to protect sensitive data.</li>
                            <li><strong>Customizable Modules:</strong> Tailor features to fit your institution's unique needs.</li>
                            <li><strong>24/7 Support:</strong> Dedicated support team ready to assist whenever needed.</li>
                            <li><strong>Mobile Access:</strong> Access on the go with responsive design or mobile app integration.</li>
                        </ul>
                    </div>
                </section>


                <section id="stats" className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 py-20">
                        <h2 className="text-3xl font-bold text-gray-600 text-center">Statistics & Impact</h2>
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                            <div>
                                <p className="text-5xl font-extrabold text-gray-600">150+</p>
                                <p className="mt-2 text-gray-600">Schools Onboarded</p>
                            </div>
                            <div>
                                <p className="text-5xl font-extrabold text-gray-600">20k+</p>
                                <p className="mt-2 text-gray-600">Active Students</p>
                            </div>
                            <div>
                                <p className="text-5xl font-extrabold text-gray-600">98%</p>
                                <p className="mt-2 text-gray-600">Satisfaction Rate</p>
                            </div>
                        </div>
                    </div>
                </section>


                <section id="contact" className="bg-gray-50">
                    <div className="max-w-3xl mx-auto px-4 py-20">
                        <h2 className="text-3xl font-bold text-gray-600 text-center">Contact Us</h2>
                        <p className="mt-4 text-center text-gray-600">Have questions or need a demo? Send us a message.</p>
                        <form className="mt-8 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" id="name" name="name" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" name="email" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea id="message" name="message" rows="4" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"></textarea>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="inline-block bg-gray-600 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-700">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>


            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} SCRM. All rights reserved.</p>
                    <div className="mt-4 sm:mt-0 space-x-4">
                        <a href="/privacy-policy" className="text-gray-600 hover:text-gray-600 text-sm">Privacy Policy</a>
                        <a href="/terms-of-service" className="text-gray-600 hover:text-gray-600 text-sm">Terms of Service</a>

                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
