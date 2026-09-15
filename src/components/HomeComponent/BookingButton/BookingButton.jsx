import { PopupButton } from "react-calendly";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function BookingSection() {
    const { t } = useTranslation('common');
    return (
        <div className="flex justify-center">
            <PopupButton
                url="https://calendly.com/fazleshifat"
                rootElement={document.getElementById("root")}
                text={
                    <span className="inline-flex items-center gap-1.5">
                        <FaCalendarAlt className="text-xs" />
                        {t('buttons.bookMeeting')}
                    </span>
                }
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 cursor-pointer border border-red-200 dark:border-red-800/40 hover:border-red-300 dark:hover:border-red-700"
            />
        </div>
    );
}
