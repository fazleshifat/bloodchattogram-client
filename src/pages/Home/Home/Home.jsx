import React, { useEffect } from 'react';
import Banner from '../../../components/HomeComponent/Banner/Banner';
import FeaturedSection from '../../../components/HomeComponent/FeaturedSection/FeaturedSection';
import ContactSection from '../../../components/HomeComponent/ContactSection/ContactSection';
import { Fade } from 'react-awesome-reveal';
import { FaTint } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Home = () => {
    const { t } = useTranslation('home');

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = t('pageTitle');
    }, [t]);

    return (
        <>
            <Banner />

            {/* Blood Group Quick Badges */}
            <section className="py-12 bg-base-100 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-6">
                    <Fade triggerOnce>
                        <div className="text-center mb-8">
                            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{t('bloodGroupsSection.heading')}</h3>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {bloodGroups.map(group => (
                                <div key={group} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 cursor-default">
                                    <FaTint className="text-red-500 text-sm" />
                                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{group}</span>
                                </div>
                            ))}
                        </div>
                    </Fade>
                </div>
            </section>

            <FeaturedSection />

            {/* CTA Section */}
            <section className="py-20 px-6">
                <Fade triggerOnce>
                    <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-12 md:p-16 shadow-2xl shadow-red-900/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {t('cta.heading')}
                            </h2>
                            <p className="text-red-100 text-lg mb-8 max-w-xl mx-auto">
                                {t('cta.subtext')}
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <a href="/blood-donation-requests" className="px-8 py-3.5 bg-white text-red-600 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl">
                                    {t('cta.donateBlood')}
                                </a>
                                <a href="/search-donors" className="px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                                    {t('cta.findDonor')}
                                </a>
                            </div>
                        </div>
                    </div>
                </Fade>
            </section>

            <ContactSection />
        </>
    );
};

export default Home;
