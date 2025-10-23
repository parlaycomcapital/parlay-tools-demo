'use client'

import { useState } from 'react'
import axios from 'axios'

interface ValuePick {
  team: string
  market: string
  odds: number
  expected_value: number
  probability: number
}

export default function Picks() {
  const [loading, setLoading] = useState(false)
  const [picks, setPicks] = useState<ValuePick[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFindPicks = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post('/api/picks', {
        candidates: [
          { team: 'Arsenal', odds: 2.1, market: 'win' },
          { team: 'Chelsea', odds: 3.2, market: 'win' },
          { team: 'Liverpool', odds: 1.8, market: 'win' },
          { team: 'Manchester City', odds: 1.5, market: 'win' },
          { team: 'Barcelona', odds: 2.5, market: 'win' },
          { team: 'Real Madrid', odds: 2.8, market: 'win' },
          { team: 'Bayern Munich', odds: 1.9, market: 'win' },
          { team: 'PSG', odds: 2.3, market: 'win' }
        ],
        threshold: 0.1
      })
      setPicks(response.data.value_picks)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Value Picks</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Find Value Betting Opportunities
          </h2>
          <p className="text-gray-600 mb-6">
            Our AI analyzes team strengths and market odds to identify value picks with positive expected value.
          </p>
          <button
            onClick={handleFindPicks}
            disabled={loading}
            className="bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Find Value Picks'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {picks.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Value Picks ({picks.length} found)
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Odds
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Probability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {picks.map((pick, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pick.team}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pick.market}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pick.odds.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(pick.probability * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-semibold ${
                        pick.expected_value > 0.2 ? 'text-green-600' : 
                        pick.expected_value > 0.1 ? 'text-yellow-600' : 'text-orange-600'
                      }`}>
                        +{(pick.expected_value * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pick.expected_value > 0.2 ? 'bg-green-100 text-green-800' : 
                        pick.expected_value > 0.1 ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {pick.expected_value > 0.2 ? 'High Value' : 
                         pick.expected_value > 0.1 ? 'Medium Value' : 'Low Value'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Expected Value (EV):</strong> The theoretical profit per unit bet over the long term.</p>
            <p><strong>Value Rating:</strong> High Value (EV > 20%), Medium Value (EV 10-20%), Low Value (EV 5-10%)</p>
          </div>
        </div>
      )}

      {picks.length === 0 && !loading && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">Click "Find Value Picks" to analyze current betting opportunities.</p>
        </div>
      )}
    </div>
  )
}
