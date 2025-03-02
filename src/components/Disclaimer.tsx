export default function Disclaimer() {
  return (
    <div className="mt-16 text-sm text-gray-500 bg-white rounded-lg shadow-lg border-2 border-blue-500 py-6 relative">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-blue-500 text-white px-8 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm">
          Disclaimer
        </span>
      </div>
      <p className="text-center leading-relaxed">
        This calculator is for informational purposes only and should not be
        considered as financial advice.
        <br />
        Tax rules and thresholds may change. Please consult with a qualified tax
        professional for specific advice.
      </p>
    </div>
  );
}
