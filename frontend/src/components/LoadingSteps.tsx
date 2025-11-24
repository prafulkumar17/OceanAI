import { useState, useEffect } from 'react'
import { Sparkles, Check, Loader, Cpu, Layers, FileText } from 'lucide-react'

export default function LoadingSteps() {
    const [activeStep, setActiveStep] = useState(0)

    const steps = [
        { text: "Initializing Neural Core", icon: Cpu },
        { text: "Analyzing Input Parameters", icon: Layers },
        { text: "Synthesizing Content Structure", icon: FileText },
        { text: "Refining Output Artifacts", icon: Sparkles },
        { text: "Finalizing Generation", icon: Check }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep(prev => {
                if (prev < steps.length - 1) return prev + 1
                clearInterval(interval)
                return prev
            })
        }, 1500)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md space-y-6">
                {steps.map((step, index) => {
                    const isActive = index === activeStep
                    const isCompleted = index < activeStep
                    const isPending = index > activeStep

                    return (
                        <div
                            key={index}
                            className={`flex items-center p-4 rounded-xl border transition-all duration-500 ${isActive
                                    ? 'bg-[#87CEEB]/10 border-[#87CEEB]/50 scale-105 shadow-[0_0_20px_rgba(135,206,235,0.1)]'
                                    : isCompleted
                                        ? 'bg-white/5 border-white/10 opacity-50'
                                        : 'opacity-30 border-transparent'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-colors duration-300 ${isActive ? 'bg-[#87CEEB] text-black' : isCompleted ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'
                                }`}>
                                {isActive ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <step.icon className="w-5 h-5" />
                                )}
                            </div>
                            <span className={`font-medium text-lg ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                {step.text}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
