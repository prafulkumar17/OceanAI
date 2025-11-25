import { Link } from 'react-router-dom'
import {
    ArrowRight,
    Sparkles
} from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="bg-mesh"></div>
            <div className="bg-noise"></div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-[#87CEEB] rounded-lg flex items-center justify-center">
                            <span className="font-bold text-black text-xl">O</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">OceanAI</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link
                            to="/login"
                            className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-24">

                {/* 1. Hero Grid */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                    {/* Main Value Prop */}
                    <div className="md:col-span-7 bento-card p-10 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#87CEEB] opacity-10 blur-[80px] rounded-full group-hover:opacity-20 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#87CEEB]/30 bg-[#87CEEB]/10 text-[#87CEEB] text-xs font-bold mb-6">
                                <Sparkles className="w-3 h-3 mr-2" />
                                V2.0 NOW LIVE
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                                Turn Chaos into <br />
                                <span className="text-gradient-lime">Structured Order.</span>
                            </h1>
                            <p className="text-gray-400 text-lg mb-8 max-w-md">
                                The AI-powered document generator for those who think faster than they type. Transform raw thoughts into polished artifacts instantly.
                            </p>
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="bg-[#87CEEB] text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#6BB6D6] transition-colors flex items-center"
                                >
                                    Start Generating
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>

                            </div>
                        </div>
                    </div>

                    {/* Visual Block */}
                    <div className="md:col-span-5 bento-card p-0 relative overflow-hidden card-cyan group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/10 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-48 h-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl transform rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500 shadow-2xl flex flex-col p-4">
                                <div className="w-full h-2 bg-white/20 rounded mb-2"></div>
                                <div className="w-3/4 h-2 bg-white/20 rounded mb-4"></div>
                                <div className="space-y-2">
                                    <div className="w-full h-1 bg-white/10 rounded"></div>
                                    <div className="w-full h-1 bg-white/10 rounded"></div>
                                    <div className="w-5/6 h-1 bg-white/10 rounded"></div>
                                </div>
                                <div className="mt-auto flex justify-center">
                                    <div className="w-8 h-8 rounded-full bg-[#00ffff] animate-pulse"></div>
                                </div>
                            </div>
                            <div className="absolute w-48 h-64 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl transform rotate-[5deg] group-hover:rotate-[10deg] transition-transform duration-500 -z-10"></div>
                        </div>
                    </div>
                </section>



            </main>
        </div >
    )
}
