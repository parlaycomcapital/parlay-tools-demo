'use client'

import { useState } from 'react'
import axios from 'axios'

interface PredictionResult {
  lambda_home: number
  lambda_away: number
  probabilities: {
    home_win: number
    away_win: number
    draw: number
    over_2_5: number
    under_2_5: number
  }
}

export default function Simulator() {
  const [homeTeam, setHomeTeam] = useState('Arsenal')
  const [awayTeam, setAwayTeam] = useState('Chelsea')
  const [sims, setSims] = useState(10000)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post('/api/predict', {
        home_team: homeTeam,
        away_team: awayTeam,
        sims: sims
      })
      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Match Simulator</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Team
              </label>
              <input
                type="text"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter home team"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Away Team
              </label>
              <input
                type="text"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter away team"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Simulations
            </label>
            <input
              type="number"
              value={sims}
              onChange={(e) => setSims(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              min="1000"
              max="100000"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Simulation Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Expected Goals</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Home Team ({homeTeam}):</span>
                  <span className="font-semibold">{result.lambda_home.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Away Team ({awayTeam}):</span>
                  <span className="font-semibold">{result.lambda_away.toFixed(3)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Match Probabilities</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Home Win:</span>
                  <span className="font-semibold">{(result.probabilities.home_win * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Away Win:</span>
                  <span className="font-semibold">{(result.probabilities.away_win * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Draw:</span>
                  <span className="font-semibold">{(result.probabilities.draw * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Over/Under Probabilities</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {(result.probabilities.over_2_5 * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-green-700">Over 2.5 Goals</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {(result.probabilities.under_2_5 * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-red-700">Under 2.5 Goals</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
