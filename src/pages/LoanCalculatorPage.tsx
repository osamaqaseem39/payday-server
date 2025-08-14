import LoanCalculator from '../components/LoanCalculator'

export default function LoanCalculatorPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Calculator</h1>
          <p className="text-gray-600">Calculate loan payments, interest, and EMI for different loan types.</p>
        </div>
      </div>

      {/* Loan Calculator Component */}
      <LoanCalculator />
    </div>
  )
} 