import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const FundingForm = ({ user, onDonationSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();

    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        if (!amount || isNaN(amount) || amount <= 0) {
            setError("Please enter a valid donation amount.");
            return;
        }

        // ✅ Show confirmation popup
        const confirmation = await Swal.fire({
            title: "Confirm Donation",
            text: `You are about to donate $${amount}. Continue?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, donate",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#0ea5e9",
        });

        if (!confirmation.isConfirmed) return;

        try {
            setLoading(true);
            const { data } = await axiosSecure.post("/fundings/payment-intent", {
                amount: parseFloat(amount),
            });

            const clientSecret = data.clientSecret;

            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card,
                        billing_details: {
                            name: user?.displayName,
                            email: user?.email,
                        },
                    },
                }
            );

            if (confirmError) {
                setError(confirmError.message);
            } else if (paymentIntent?.status === "succeeded") {
                const paymentRecord = {
                    name: user?.displayName,
                    email: user?.email,
                    amount: parseFloat(amount),
                    date: new Date(),
                    transactionId: paymentIntent.id,
                };

                await axiosSecure.post("/fundings", paymentRecord);

                setSuccess("Thank you! Your donation was successful.");
                setAmount("");
                onDonationSuccess(); // ✅ notify parent
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mt-6 space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Give Fund</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Donation Amount Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Donation Amount (USD)
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="$amount"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                    />
                </div>

                {/* Stripe Card Element */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Card Information
                    </label>
                    <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#1a202c",
                                        '::placeholder': {
                                            color: "#a0aec0",
                                        },
                                        fontFamily: "Inter, sans-serif",
                                    },
                                    invalid: {
                                        color: "#e53e3e",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500"
                >
                    {loading ? "Processing..." : "Pay & Support"}
                </button>

                {/* Error or Success Message */}
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                {success && <p className="text-green-500 text-sm font-medium">{success}</p>}
            </form>
        </div>
    );

};

export default FundingForm;
