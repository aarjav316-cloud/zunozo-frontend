import { useState, useEffect } from "react";

const ReviewModal = ({ isOpen, onClose, onConfirm, event, action }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isSubmitting]);

  const handleSubmit = async () => {
    if (
      (action === "REJECTED" || action === "CHANGES_REQUESTED") &&
      !comment.trim()
    ) {
      return;
    }

    setIsSubmitting(true);
    await onConfirm(action, comment);
    setIsSubmitting(false);
    setComment("");
  };

  if (!isOpen) return null;

  const actionConfig = {
    APPROVED: {
      title: "Approve Event",
      color: "emerald",
      icon: (
        <svg
          className="w-6 h-6 text-emerald-500"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      message: "Are you sure you want to approve this event?",
    },
    REJECTED: {
      title: "Reject Event",
      color: "rose",
      icon: (
        <svg
          className="w-6 h-6 text-rose-500"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      message: "Please provide a reason for rejection:",
    },
    CHANGES_REQUESTED: {
      title: "Request Changes",
      color: "blue",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      ),
      message: "Please specify what changes are needed:",
    },
  };

  const config = actionConfig[action];
  const requiresComment =
    action === "REJECTED" || action === "CHANGES_REQUESTED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={isSubmitting ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#18181B] border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`w-12 h-12 rounded-full bg-${config.color}-500/10 flex items-center justify-center shrink-0`}
          >
            {config.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              {config.title}
            </h3>
            <p className="text-sm text-zinc-400 mb-1">{config.message}</p>
            <p className="text-sm text-zinc-500">Event: {event?.title}</p>
          </div>
        </div>

        {requiresComment && (
          <div className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment..."
              rows="4"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors resize-none disabled:opacity-50"
            />
            {requiresComment && !comment.trim() && (
              <p className="text-xs text-rose-500 mt-2">Comment is required</p>
            )}
          </div>
        )}

        {!requiresComment && (
          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-2">
              Optional Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment (optional)..."
              rows="3"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors resize-none disabled:opacity-50"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 h-10 px-4 bg-transparent border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (requiresComment && !comment.trim())}
            className={`flex-1 h-10 px-4 bg-${config.color}-500 text-white rounded-xl font-medium hover:bg-${config.color}-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
