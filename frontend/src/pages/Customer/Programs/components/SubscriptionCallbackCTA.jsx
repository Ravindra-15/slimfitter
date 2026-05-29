/**
 * Diabmukt — Subscription Callback CTA
 * One-click callback request for logged-in users.
 * Locks permanently once requested (verified against backend on mount).
 */

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import {
  submitSubscriptionCallback,
  checkSubscriptionCallback,
} from "../../../../services/customerEnquiryService";
import { fetchMyProfile } from "../../../../services/customerProfileService";

const DEFAULT_MESSAGE = "User needs help selecting a subscription tenure.";

export default function SubscriptionCallbackCTA({ programId }) {
  const [submitting, setSubmitting] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [requested, setRequested] = useState(false);
  const [checking, setChecking] = useState(true);

  // 🔎 On mount — check if this user already requested a callback
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const already = await checkSubscriptionCallback(programId);
        if (mounted) setRequested(already);
      } catch {
        // soft fail — leave button active
      } finally {
        if (mounted) setChecking(false);
      }
    };
    check();
    return () => {
      mounted = false;
    };
  }, [programId]);

  const handleCallback = async () => {
    if (submitting || requested) return;

    setSubmitting(true);
    try {
      const profile = await fetchMyProfile();

      const name = profile?.fullName || profile?.nickName || "";
      const phone =
        profile?.phone || profile?.mobile || profile?.phoneNumber || "";
      const email = profile?.email || "";

      if (!name || !phone) {
        toast.error("Please complete your profile to request a callback.");
        setSubmitting(false);
        return;
      }

      await submitSubscriptionCallback({
        name,
        phone,
        email,
        message: DEFAULT_MESSAGE,
        source: programId,
      });

      setRequested(true);
      setShowThanks(true);
    } catch (err) {
      // 409 = already requested (e.g. another tab) — lock the button
      if (err?.response?.status === 409) {
        setRequested(true);
        toast.error("You have already requested a callback.");
      } else {
        toast.error(
          err?.response?.data?.message || "Failed to request callback."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* CTA CARD */}
      <div className="bg-white rounded-3xl shadow-xl w-full px-6 sm:px-10 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-6 sm:gap-10">
          {/* Text */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug mb-2">
              Unsure which tenure is right for your health goals?
            </h3>
            <p className="text-[#475569] text-sm leading-relaxed mb-5">
              Everyone's diabetes journey is unique. Speak with a Diabmukt
              specialist to determine if you need a 12, 24, or 48-week protocol
              based on your body profile.
            </p>
            <button
              onClick={handleCallback}
              disabled={submitting || requested || checking}
              className={`text-sm font-semibold px-6 py-2.5 rounded-full transition-colors border ${
                requested
                  ? "border-green-400 text-green-600 bg-green-50 cursor-default"
                  : "border-[#4F46E5] text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white disabled:opacity-60"
              }`}
            >
              {requested
                ? "Callback Requested ✓"
                : checking
                ? "Loading..."
                : submitting
                ? "Requesting..."
                : "Get A Callback"}
            </button>
          </div>

          {/* Image */}
          <div className="flex justify-center sm:justify-end">
            <img
              src="/images/subscriptioncallback.png"
              alt="Speak with a specialist"
              className="w-[220px] lg:w-[260px] h-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* THANKS POPUP */}
      {showThanks && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl w-full max-w-sm px-7 py-8 text-center relative">
            <button
              onClick={() => setShowThanks(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-[#0F172A] mb-1">Thanks!</h3>
            <p className="text-sm text-[#475569] mb-5">
              You Will Receive A Callback Shortly
            </p>

            <img
              src="/images/gobackcardimage.png"
              alt="Callback confirmed"
              className="w-[180px] h-auto object-contain mx-auto mb-6"
            />

            <button
              onClick={() => setShowThanks(false)}
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold py-3 rounded-full transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </>
  );
}