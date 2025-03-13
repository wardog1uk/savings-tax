import { ClipboardList } from "lucide-react";

export default function EmptyResults() {
  return (
    <div className="tab-page min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-2">
        <ClipboardList className="h-8 w-8 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">
        Your Tax Calculation Results
      </h3>
      <p className="text-gray-500 max-w-sm">
        Enter your income details and click "Calculate" to see your tax
        breakdown here
      </p>
    </div>
  );
}
