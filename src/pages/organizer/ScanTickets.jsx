import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { checkInBooking } from "../../api/bookingApi";

/**
 * =====================================================
 * SCAN TICKETS PAGE (Organizer QR Scanner)
 * =====================================================
 * Camera-based QR scanner for event check-in with:
 * - html5-qrcode camera integration
 * - ZUNO:<ticketCode> payload extraction
 * - Backend check-in API call
 * - Success / Used / Invalid / Unauthorized result states
 * - Scan lock to prevent duplicate requests
 * - Camera permission handling
 * - Responsive design for mobile scanning
 *
 * Design: Matches the existing Zunozo dark theme
 * (bg-[#09090B], zinc borders, Geist font)
 * =====================================================
 */

const SCANNER_STATES = {
  IDLE: "IDLE",
  SCANNING: "SCANNING",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  ALREADY_USED: "ALREADY_USED",
  INVALID: "INVALID",
  UNAUTHORIZED: "UNAUTHORIZED",
  ERROR: "ERROR",
};

const ScanTickets = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  const [scannerState, setScannerState] = useState(SCANNER_STATES.IDLE);
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [cameraError, setCameraError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  /**
   * ---------------------------------------------------
   * Extract ticket code from QR payload
   * ---------------------------------------------------
   * Expected format: ZUNO:<ticketCode>
   */
  const extractTicketCode = (qrValue) => {
    if (!qrValue || typeof qrValue !== "string") return null;
    const trimmed = qrValue.trim();
    if (trimmed.startsWith("ZUNO:")) {
      const code = trimmed.substring(5).trim();
      return code.length > 0 ? code : null;
    }
    return null;
  };

  /**
   * ---------------------------------------------------
   * Handle successful QR code detection
   * ---------------------------------------------------
   */
  const handleScanSuccess = useCallback(
    async (decodedText) => {
      // Prevent duplicate processing
      if (isProcessing) return;
      setIsProcessing(true);

      // Stop scanner while processing
      try {
        if (html5QrRef.current?.isScanning) {
          await html5QrRef.current.stop();
        }
      } catch {
        // Scanner may already be stopped
      }

      setScannerState(SCANNER_STATES.PROCESSING);

      // Extract and validate ticket code
      const ticketCode = extractTicketCode(decodedText);

      if (!ticketCode) {
        setScannerState(SCANNER_STATES.INVALID);
        setErrorMessage("Invalid Zunozo ticket. QR code format not recognized.");
        setIsProcessing(false);
        return;
      }

      // Call check-in API
      try {
        const response = await checkInBooking(ticketCode);

        if (response.success) {
          setScannerState(SCANNER_STATES.SUCCESS);
          setResultData(response.data);
          setScanCount((prev) => prev + 1);
        } else {
          setScannerState(SCANNER_STATES.ERROR);
          setErrorMessage(response.message || "Check-in failed.");
        }
      } catch (err) {
        const message = err.message || "Unable to check in ticket.";

        if (
          message.toLowerCase().includes("already been used") ||
          message.toLowerCase().includes("already been checked")
        ) {
          setScannerState(SCANNER_STATES.ALREADY_USED);
          setResultData(err.data || null);
          setErrorMessage(message);
        } else if (
          message.toLowerCase().includes("not authorized") ||
          message.toLowerCase().includes("unauthorized")
        ) {
          setScannerState(SCANNER_STATES.UNAUTHORIZED);
          setErrorMessage(message);
        } else if (
          message.toLowerCase().includes("cancelled")
        ) {
          setScannerState(SCANNER_STATES.INVALID);
          setErrorMessage(message);
        } else if (
          message.toLowerCase().includes("not found") ||
          message.toLowerCase().includes("invalid")
        ) {
          setScannerState(SCANNER_STATES.INVALID);
          setErrorMessage(message);
        } else {
          setScannerState(SCANNER_STATES.ERROR);
          setErrorMessage(message);
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing]
  );

  /**
   * ---------------------------------------------------
   * Start the camera scanner
   * ---------------------------------------------------
   */
  const startScanner = useCallback(async () => {
    setCameraError(null);
    setScannerState(SCANNER_STATES.SCANNING);
    setResultData(null);
    setErrorMessage("");

    try {
      if (!html5QrRef.current) {
        html5QrRef.current = new Html5Qrcode("qr-reader");
      }

      // Stop if already running
      if (html5QrRef.current.isScanning) {
        await html5QrRef.current.stop();
      }

      await html5QrRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        handleScanSuccess,
        () => {} // Ignore scan failures (QR not in frame)
      );
    } catch (err) {
      const errMsg = err?.toString() || "";
      if (
        errMsg.includes("NotAllowedError") ||
        errMsg.includes("Permission")
      ) {
        setCameraError(
          "Camera permission denied. Please allow camera access in your browser settings."
        );
      } else if (
        errMsg.includes("NotFoundError") ||
        errMsg.includes("no camera")
      ) {
        setCameraError(
          "No camera found. Please connect a camera and try again."
        );
      } else {
        setCameraError(
          "Unable to start camera. Please check permissions and try again."
        );
      }
      setScannerState(SCANNER_STATES.IDLE);
    }
  }, [handleScanSuccess]);

  /**
   * ---------------------------------------------------
   * Stop the camera scanner
   * ---------------------------------------------------
   */
  const stopScanner = useCallback(async () => {
    try {
      if (html5QrRef.current?.isScanning) {
        await html5QrRef.current.stop();
      }
    } catch {
      // Ignore
    }
    setScannerState(SCANNER_STATES.IDLE);
  }, []);

  /**
   * ---------------------------------------------------
   * Handle "Scan Next" — resume scanner
   * ---------------------------------------------------
   */
  const handleScanNext = useCallback(() => {
    setResultData(null);
    setErrorMessage("");
    startScanner();
  }, [startScanner]);

  /**
   * ---------------------------------------------------
   * Cleanup camera on unmount
   * ---------------------------------------------------
   */
  useEffect(() => {
    return () => {
      if (html5QrRef.current?.isScanning) {
        html5QrRef.current.stop().catch(() => {});
      }
    };
  }, []);

  /**
   * ---------------------------------------------------
   * Result Icon Component
   * ---------------------------------------------------
   */
  const ResultIcon = ({ type }) => {
    if (type === "success") {
      return (
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <svg className="w-10 h-10 text-emerald-400" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      );
    }
    if (type === "warning") {
      return (
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-amber-400" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-rose-400" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate("/organizer/dashboard")}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Dashboard
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2"
            style={{
              fontFamily: '"Geist", sans-serif',
              letterSpacing: "-0.03em",
            }}
          >
            Scan Tickets
          </h1>
          <p className="text-zinc-500">
            Scan attendee QR codes to check them in
          </p>
          {scanCount > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-400">
                {scanCount} checked in this session
              </span>
            </div>
          )}
        </div>

        {/* Scanner Container */}
        <div className="bg-[#18181B] border border-zinc-800 rounded-2xl overflow-hidden">
          {/* Camera Error */}
          {cameraError && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Camera Unavailable</h3>
              <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto">
                {cameraError}
              </p>
              <button
                onClick={() => {
                  setCameraError(null);
                  startScanner();
                }}
                className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* IDLE State - Start Scanner */}
          {scannerState === SCANNER_STATES.IDLE && !cameraError && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[#6366F1]/10 border-2 border-[#6366F1]/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#6366F1]" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Ready to Scan
              </h3>
              <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto">
                Tap the button below to open your camera and start scanning attendee tickets.
              </p>
              <button
                onClick={startScanner}
                className="px-8 py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors text-base"
              >
                Start Scanner
              </button>
            </div>
          )}

          {/* SCANNING State — Camera Feed */}
          {scannerState === SCANNER_STATES.SCANNING && (
            <div>
              <div className="relative">
                <div
                  id="qr-reader"
                  ref={scannerRef}
                  className="w-full"
                  style={{ minHeight: "320px" }}
                />
                {/* Overlay instruction */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-center text-white text-sm font-medium">
                    Position the QR code inside the frame
                  </p>
                </div>
              </div>
              <div className="p-4 flex justify-center">
                <button
                  onClick={stopScanner}
                  className="px-6 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition-colors text-sm"
                >
                  Stop Scanner
                </button>
              </div>
            </div>
          )}

          {/* PROCESSING State */}
          {scannerState === SCANNER_STATES.PROCESSING && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 border-4 border-zinc-800 border-t-[#6366F1] rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-lg font-semibold text-white mb-1">
                Checking in...
              </h3>
              <p className="text-zinc-500 text-sm">Validating ticket</p>
            </div>
          )}

          {/* SUCCESS State */}
          {scannerState === SCANNER_STATES.SUCCESS && (
            <div className="p-8 text-center">
              <ResultIcon type="success" />
              <h3 className="text-2xl font-bold text-emerald-400 mb-1">
                Check-in Successful
              </h3>
              <p className="text-zinc-400 text-sm mb-6">Entry allowed</p>

              {resultData && (
                <div className="bg-zinc-900 rounded-xl p-5 mb-6 text-left space-y-3 border border-white/5">
                  {resultData.event?.title && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 text-sm">Event</span>
                      <span className="text-white text-sm font-medium">
                        {resultData.event.title}
                      </span>
                    </div>
                  )}
                  {resultData.ticketCode && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 text-sm">Ticket</span>
                      <span className="text-white text-sm font-mono">
                        {resultData.ticketCode}
                      </span>
                    </div>
                  )}
                  {resultData.user?.name && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 text-sm">Attendee</span>
                      <span className="text-white text-sm font-medium">
                        {resultData.user.name}
                      </span>
                    </div>
                  )}
                  {resultData.quantity && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 text-sm">Tickets</span>
                      <span className="text-white text-sm">
                        {resultData.quantity}
                      </span>
                    </div>
                  )}
                  {resultData.checkedInAt && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 text-sm">Checked In</span>
                      <span className="text-emerald-400 text-sm">
                        {new Date(resultData.checkedInAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleScanNext}
                className="w-full py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
              >
                Scan Next
              </button>
            </div>
          )}

          {/* ALREADY_USED State */}
          {scannerState === SCANNER_STATES.ALREADY_USED && (
            <div className="p-8 text-center">
              <ResultIcon type="warning" />
              <h3 className="text-2xl font-bold text-amber-400 mb-1">
                Ticket Already Used
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                {errorMessage || "This ticket has already been checked in."}
              </p>
              {resultData?.checkedInAt && (
                <p className="text-zinc-500 text-xs mb-6">
                  Checked in at:{" "}
                  {new Date(resultData.checkedInAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              )}
              <button
                onClick={handleScanNext}
                className="w-full py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
              >
                Scan Next
              </button>
            </div>
          )}

          {/* INVALID State */}
          {scannerState === SCANNER_STATES.INVALID && (
            <div className="p-8 text-center">
              <ResultIcon type="error" />
              <h3 className="text-2xl font-bold text-rose-400 mb-1">
                Invalid Ticket
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                {errorMessage || "This ticket cannot be checked in."}
              </p>
              <button
                onClick={handleScanNext}
                className="w-full py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
              >
                Scan Again
              </button>
            </div>
          )}

          {/* UNAUTHORIZED State */}
          {scannerState === SCANNER_STATES.UNAUTHORIZED && (
            <div className="p-8 text-center">
              <ResultIcon type="error" />
              <h3 className="text-2xl font-bold text-rose-400 mb-1">
                Unauthorized
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                {errorMessage || "This ticket belongs to another organizer's event."}
              </p>
              <button
                onClick={handleScanNext}
                className="w-full py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
              >
                Scan Again
              </button>
            </div>
          )}

          {/* ERROR State */}
          {scannerState === SCANNER_STATES.ERROR && (
            <div className="p-8 text-center">
              <ResultIcon type="error" />
              <h3 className="text-2xl font-bold text-rose-400 mb-1">
                Check-in Failed
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                {errorMessage || "Something went wrong. Please try again."}
              </p>
              <button
                onClick={handleScanNext}
                className="w-full py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 bg-[#18181B] border border-zinc-800 rounded-2xl p-5">
          <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-zinc-500" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            Scanner Tips
          </h4>
          <ul className="space-y-2 text-xs text-zinc-500">
            <li className="flex items-start gap-2">
              <span className="text-zinc-600 mt-0.5">•</span>
              Hold the QR code steady within the scanner frame
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-600 mt-0.5">•</span>
              Ensure good lighting for faster scanning
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-600 mt-0.5">•</span>
              Each ticket can only be scanned once
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-600 mt-0.5">•</span>
              You can only check in tickets for your own events
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScanTickets;
