import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to Parlay Tools
      </h1>
      <p className="text-xl text-gray-600 mb-12">
        AI-powered sports analytics and betting insights
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link href="/simulator" className="block">
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Match Simulator
            </h2>
            <p className="text-gray-600">
              Predict match outcomes using AI-powered Poisson simulation
            </p>
          </div>
        </Link>
        
        <Link href="/picks" className="block">
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Value Picks
            </h2>
            <p className="text-gray-600">
              Find value betting opportunities with expected value analysis
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
