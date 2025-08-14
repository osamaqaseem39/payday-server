import { useState } from 'react'
import { HiCalculator, HiCurrencyDollar, HiClock, HiTrendingUp } from 'react-icons/hi'

// Simple Interest
const simpleInterest = (principal: number, rate: number, time: number) => {
  return principal * (rate / 100) * (time / 365);
};

// Compound Interest
const compoundInterest = (principal: number, rate: number, time: number, frequency: number = 1) => {
  return principal * Math.pow(1 + (rate / 100) / frequency, frequency * time) - principal;
};

// Monthly Payment (EMI)
const monthlyPayment = (principal: number, rate: number, months: number) => {
  const monthlyRate = rate / 100 / 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
         (Math.pow(1 + monthlyRate, months) - 1);
};

export default function LoanCalculator() {
  const [loanType, setLoanType] = useState('simple')
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [time, setTime] = useState('')
  const [frequency, setFrequency] = useState('12')
  const [results, setResults] = useState<any>(null)

  const calculateLoan = () => {
    const p = parseFloat(principal)
    const r = parseFloat(rate)
    const t = parseFloat(time)
    const freq = parseFloat(frequency)

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      alert('Please enter valid numbers')
      return
    }

    let interest = 0
    let totalAmount = 0
    let monthlyEMI = 0

    switch (loanType) {
      case 'simple':
        interest = simpleInterest(p, r, t)
        totalAmount = p + interest
        break
      case 'compound':
        interest = compoundInterest(p, r, t, freq)
        totalAmount = p + interest
        break
      case 'emi':
        monthlyEMI = monthlyPayment(p, r, t)
        totalAmount = monthlyEMI * t
        interest = totalAmount - p
        break
    }

    setResults({
      principal: p,
      interest: interest,
      totalAmount: totalAmount,
      monthlyEMI: monthlyEMI
    })
  }

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-primary-600 mr-3" />
        <h3 className="text-lg font-medium text-gray-900">Loan Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Type
            </label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="input"
            >
              <option value="simple">Simple Interest</option>
              <option value="compound">Compound Interest</option>
              <option value="emi">Monthly EMI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Principal Amount ($)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="Enter principal amount"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Enter annual interest rate"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {loanType === 'emi' ? 'Loan Term (Months)' : 'Time Period (Days)'}
            </label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder={loanType === 'emi' ? 'Enter loan term in months' : 'Enter time period in days'}
              className="input"
            />
          </div>

          {loanType === 'compound' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compounding Frequency (per year)
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="input"
              >
                <option value="1">Annually</option>
                <option value="2">Semi-annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
              </select>
            </div>
          )}

          <button
            onClick={calculateLoan}
            className="btn-primary w-full"
          >
            Calculate
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results && (
            <>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Loan Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <HiCurrencyDollar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Principal Amount:</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${results.principal.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <HiTrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Interest Amount:</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${results.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <HiCurrencyDollar className="h-4 w-4 text-primary-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Total Amount:</span>
                    </div>
                    <span className="text-sm font-bold text-primary-600">
                      ${results.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {loanType === 'emi' && results.monthlyEMI > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <HiClock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Monthly EMI:</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        ${results.monthlyEMI.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-primary-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-primary-700 mb-2">Calculation Details</h4>
                <p className="text-xs text-primary-600">
                  {loanType === 'simple' && 'Simple interest calculated on principal amount only'}
                  {loanType === 'compound' && `Compound interest calculated with ${frequency} compounding periods per year`}
                  {loanType === 'emi' && 'Equal Monthly Installment (EMI) calculated with fixed monthly payments'}
                </p>
              </div>
            </>
          )}

          {!results && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <HiCalculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500">
                Enter loan details and click Calculate to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 