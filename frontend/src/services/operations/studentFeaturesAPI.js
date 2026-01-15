/**
 * @file studentFeaturesAPI.js
 * @description Student payment API operations for the StudyX frontend
 * @module services/operations/studentFeaturesAPI
 * 
 * Handles course purchase flow using Stripe payment gateway.
 * Creates checkout sessions, redirects to Stripe, verifies payments,
 * and manages course enrollment after successful payment.
 */

import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { 
    STRIPE_CHECKOUT_API, 
    STRIPE_VERIFY_API, 
    SEND_PAYMENT_SUCCESS_EMAIL_API 
} = studentEndpoints;

// ================ Create Stripe Checkout Session ================
export async function createStripeCheckout(token, coursesId) {
    const toastId = toast.loading("Initializing payment...");
    let result = null;

    try {
        const response = await apiConnector(
            "POST",
            STRIPE_CHECKOUT_API,
            { coursesId },
            { Authorization: `Bearer ${token}` }
        );

        console.log("STRIPE CHECKOUT RESPONSE:", response);

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        result = response.data;
        toast.dismiss(toastId);
    } catch (error) {
        console.log("STRIPE CHECKOUT ERROR:", error);
        toast.dismiss(toastId);
        toast.error(error.response?.data?.message || "Could not initialize payment");
    }

    return result;
}

// ================ Verify Stripe Payment ================
export async function verifyStripePayment(token, sessionId, navigate, dispatch) {
    const toastId = toast.loading("Verifying payment...");
    dispatch(setPaymentLoading(true));

    try {
        const response = await apiConnector(
            "POST",
            STRIPE_VERIFY_API,
            { sessionId },
            { Authorization: `Bearer ${token}` }
        );

        console.log("STRIPE VERIFY RESPONSE:", response);

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.dismiss(toastId);
        toast.success("Payment successful! You are now enrolled.");
        dispatch(resetCart());
        navigate("/dashboard/enrolled-courses");
        return true;
    } catch (error) {
        console.log("STRIPE VERIFY ERROR:", error);
        toast.dismiss(toastId);
        toast.error(error.response?.data?.message || "Payment verification failed");
        return false;
    } finally {
        dispatch(setPaymentLoading(false));
    }
}

// ================ Buy Course (Redirect to Stripe) ================
export async function buyCourse(token, coursesId, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Redirecting to payment...");

    try {
        const response = await apiConnector(
            "POST",
            STRIPE_CHECKOUT_API,
            { coursesId },
            { Authorization: `Bearer ${token}` }
        );

        console.log("STRIPE CHECKOUT RESPONSE:", response);

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.dismiss(toastId);

        // Redirect to Stripe Checkout
        if (response.data.checkoutUrl) {
            window.location.href = response.data.checkoutUrl;
        } else {
            throw new Error("No checkout URL received");
        }

    } catch (error) {
        console.log("BUY COURSE ERROR:", error);
        toast.dismiss(toastId);
        toast.error(error.response?.data?.message || "Could not process payment");
    }
}

// ================ Send Payment Success Email ================
export async function sendPaymentSuccessEmail(token, orderId, paymentId, amount) {
    try {
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            { orderId, paymentId, amount },
            { Authorization: `Bearer ${token}` }
        );
    } catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR:", error);
    }
}
