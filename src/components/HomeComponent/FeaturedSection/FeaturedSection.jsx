import { Fade } from "react-awesome-reveal";
import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const featuredItems = [
    { id: 1, key: "awareness", image: "/assets/banner1.jpg", color: "from-red-500 to-rose-600" },
    { id: 2, key: "emergency", image: "/assets/banner2.png", color: "from-orange-500 to-red-600" },
    { id: 3, key: "healthCamps", image: "/assets/banner3.png", color: "from-emerald-500 to-teal-600" },
    { id: 4, key: "appreciation", image: "/assets/banner4.jpg", color: "from-violet-500 to-purple-600" },
    { id: 5, key: "youth", image: "/assets/banner5.jpg", color: "from-blue-500 to-indigo-600" },
    { id: 6, key: "mobileUnits", image: "/assets/banner6.jpg", color: "from-pink-500 to-rose-600" },
];

const FeaturedSection = () => {
    const { t } = useTranslation(['home', 'common']);

    return (
        <section className="py-20 px-5 bg-base-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <Fade cascade damping={0.1} triggerOnce>
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
                            {t('featured.eyebrow')}
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('featured.heading')} <span className="gradient-text">{t('featured.headingHighlight')}</span>
                        </h2>
                        <div className="section-divider mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            {t('featured.subtext')}
                        </p>
                    </div>
                </Fade>

                <Fade cascade damping={0.08} triggerOnce>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {featuredItems.map(item => (
                            <div
                                key={item.id}
                                className="group bg-base-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 card-hover"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={t(`featured.items.${item.key}.title`)}
                                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white text-xs font-medium shadow-lg`}>
                                            {t('common:buttons.learnMore')} <FaArrowRight className="text-[10px]" />
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                        {t(`featured.items.${item.key}.title`)}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                        {t(`featured.items.${item.key}.description`)}
                                    </p>
                                    <Link
                                        to="/dashboard"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:gap-3 transition-all duration-300"
                                    >
                                        {t('common:buttons.explore')} <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </Fade>
            </div>
        </section>
    );
};

export default FeaturedSection;
