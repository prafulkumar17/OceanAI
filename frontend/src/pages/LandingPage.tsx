import { Link } from 'react-router-dom'
import {
    ArrowRight,
    Zap,
    Shield,
    Cpu,
    FileText,
    MonitorPlay,
    Check,
    Sparkles,
    Layers,
    Globe
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
                        <div className="w-8 h-8 bg-[#ccff00] rounded-lg flex items-center justify-center">
                            <span className="font-bold text-black text-xl">O</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">OceanAI</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#process" className="hover:text-white transition-colors">Process</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
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
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00] opacity-10 blur-[80px] rounded-full group-hover:opacity-20 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#ccff00]/30 bg-[#ccff00]/10 text-[#ccff00] text-xs font-bold mb-6">
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
                                    className="bg-[#ccff00] text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#b3e600] transition-colors flex items-center"
                                >
                                    Start Generating
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs font-bold">
                                            U{i}
                                        </div>
                                    ))}
                                </div>
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

                {/* 2. Trust Ticker */}
                <section className="bento-card py-6 px-10 overflow-hidden flex items-center justify-between">
                    <span className="text-gray-500 font-mono text-sm uppercase mr-8 whitespace-nowrap">Trusted by Dorks at</span>
                    <div className="flex space-x-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella', 'Cyberdyne'].map((company) => (
                            <span key={company} className="font-bold text-xl">{company}</span>
                        ))}
                    </div>
                </section>

                {/* 3. Feature Matrix */}
                <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                    {/* Large Card */}
                    <div className="md:col-span-2 md:row-span-2 bento-card p-10 card-magenta relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff00ff] opacity-5 blur-[100px] rounded-full"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 bg-[#ff00ff]/20 rounded-xl flex items-center justify-center mb-6 text-[#ff00ff]">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">AI-Powered Refinement</h3>
                                <p className="text-gray-400 text-lg max-w-md">
                                    Our neural engine doesn't just write; it iterates. Refine tone, expand concepts, and polish syntax with a single click.
                                </p>
                            </div>
                            <div className="bg-black/30 rounded-xl p-4 border border-white/10 backdrop-blur-sm font-mono text-sm text-[#ff00ff]">
                                {'>'} Refine: "Make it more professional"<br />
                                <span className="text-white">{'>'} Processing... Done.</span>
                            </div>
                        </div>
                    </div>

                    {/* Tall Card */}
                    <div className="md:row-span-2 bento-card p-8 card-cyan flex flex-col justify-center items-center text-center group">
                        <div className="space-y-4 mb-8 group-hover:scale-110 transition-transform duration-300">
                            <div className="w-16 h-20 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center mx-auto transform -rotate-12 translate-y-4">
                                <FileText className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className="w-16 h-20 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center mx-auto transform rotate-12 -translate-y-4 z-10 relative bg-[#050505]">
                                <MonitorPlay className="w-8 h-8 text-orange-400" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Export Anywhere</h3>
                        <p className="text-gray-400 text-sm">Native support for DOCX and PPTX formats.</p>
                    </div>

                    {/* Small Card 1 */}
                    <div className="bento-card p-6 flex flex-col justify-between group hover:bg-white/5">
                        <Zap className="w-8 h-8 text-[#ccff00]" />
                        <div>
                            <h4 className="text-xl font-bold">Lightning Fast</h4>
                            <p className="text-gray-400 text-sm">Generates in seconds.</p>
                        </div>
                    </div>

                    {/* Small Card 2 */}
                    <div className="bento-card p-6 flex flex-col justify-between group hover:bg-white/5">
                        <Shield className="w-8 h-8 text-[#00ffff]" />
                        <div>
                            <h4 className="text-xl font-bold">Enterprise Secure</h4>
                            <p className="text-gray-400 text-sm">Bank-grade encryption.</p>
                        </div>
                    </div>
                </section>

                {/* 4. Process Flow */}
                <section id="process" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { step: '01', title: 'Input Idea', desc: 'Enter a topic or rough notes.', icon: Layers },
                        { step: '02', title: 'AI Magic', desc: 'Our engine structures the chaos.', icon: Sparkles },
                        { step: '03', title: 'Artifact', desc: 'Download polished documents.', icon: Check }
                    ].map((item, i) => (
                        <div key={i} className="bento-card p-8 relative group">
                            <div className="absolute top-4 right-4 text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                                {item.step}
                            </div>
                            <item.icon className="w-10 h-10 mb-6 text-gray-300 group-hover:text-white transition-colors" />
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </section>

                {/* 5. Pricing Grid */}
                <section id="pricing" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bento-card p-10 flex flex-col">
                        <h3 className="text-2xl font-bold mb-2">Hobbyist</h3>
                        <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        <ul className="space-y-4 mb-8 flex-grow">
                            {['5 Documents/mo', 'Basic Export', 'Community Support'].map((feat) => (
                                <li key={feat} className="flex items-center text-gray-300">
                                    <Check className="w-5 h-5 mr-3 text-gray-500" /> {feat}
                                </li>
                            ))}
                        </ul>
                        <Link to="/login" className="w-full py-3 rounded-xl border border-white/20 text-center font-bold hover:bg-white/5 transition-colors">
                            Start Free
                        </Link>
                    </div>

                    <div className="bento-card p-10 flex flex-col border-[#ccff00]/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#ccff00] text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
                            BEST VALUE
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-[#ccff00]">Pro Dork</h3>
                        <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        <ul className="space-y-4 mb-8 flex-grow">
                            {['Unlimited Documents', 'Priority Processing', 'Advanced Refinement', 'All Formats'].map((feat) => (
                                <li key={feat} className="flex items-center text-white">
                                    <Check className="w-5 h-5 mr-3 text-[#ccff00]" /> {feat}
                                </li>
                            ))}
                        </ul>
                        <Link to="/login" className="w-full py-3 rounded-xl bg-[#ccff00] text-black text-center font-bold hover:bg-[#b3e600] transition-colors shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                            Go Pro
                        </Link>
                    </div>
                </section>

                {/* 6. Footer */}
                <section className="bento-card p-12 md:p-20 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00]/10 via-transparent to-[#00ffff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10">
                        Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#00ffff]">Disrupt?</span>
                    </h2>
                    <Link
                        to="/login"
                        className="inline-block bg-white text-black px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform duration-300 relative z-10"
                    >
                        Get Started Now
                    </Link>
                </section>

                <footer className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="w-6 h-6 bg-[#333] rounded flex items-center justify-center">
                            <span className="font-bold text-white text-xs">D</span>
                        </div>
                        <span>© 2025 Dorksense AI</span>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Twitter</a>
                    </div>
                </footer>

            </main>
        </div>
    )
}
