"use client"
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";

const VerifyPage = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState(null);
    const [verificationStep, setVerificationStep] = useState(0);

    useEffect(() => {
        setVerificationStep(0);
        setLoading(true);

        const stepInterval = setInterval(() => {
            setVerificationStep(prev => {
                if (prev < 3) {
                    return prev + 1;
                } else {
                    clearInterval(stepInterval);
                    return prev;
                }
            });
        }, 600);

        const verificationTimeout = setTimeout(async () => {
            try {
                const token = pathname.split('/').pop();
                const res = await fetch(`/api/auth/verify/${token}`);
                const data = await res.json();
                setResponse(data);

                if (data.success) {
                    toast.success("🎉 Compte vérifié avec succès !");
                    setTimeout(() => {
                        router.push('/auth/profile');
                    }, 2000);
                }
            } catch (error) {
                toast.error("Une erreur est survenue lors de la vérification.");
                setResponse({success: false, message: "Erreur lors de la vérification"});
            } finally {
                setLoading(false);
            }
        }, 2400);

        return () => {
            clearInterval(stepInterval);
            clearTimeout(verificationTimeout);
        };
    }, [pathname, router]);

    const steps = [
        "Récupération du token...",
        "Vérification de la validité...",
        "Confirmation du compte...",
        "Finalisation..."
    ];

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div
                    className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
            </div>

            <div
                className="card glass shadow-2xl w-full max-w-lg backdrop-blur-sm border border-white/10 relative z-10">
                <div className="card-body p-8">
                    <div className="text-center mb-8">
                        <div
                            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Vérification
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Sécurisation de votre compte Loup-Garou
                        </p>
                    </div>

                    {loading && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-8 px-4">
                                {[1, 2, 3, 4].map((step) => (
                                    <div key={step} className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                                verificationStep >= step
                                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                                                    : 'bg-base-200/50 text-gray-400'
                                            }`}>
                                            {verificationStep > step ? (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            ) : (
                                                <span className="font-semibold text-sm">{step}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="absolute top-32 left-8 right-8 h-1 bg-base-200/50 -z-10">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out"
                                        style={{width: `${(verificationStep / 4) * 100}%`}}
                                    ></div>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2 animate-pulse">
                                    {steps[verificationStep]}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {verificationStep < 3 ? "Veuillez patienter..." : "Dernière étape en cours..."}
                                </p>
                            </div>
                        </div>
                    )}

                    {!loading && response && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="text-center">
                                <div
                                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 ${
                                        response.success
                                            ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                            : 'bg-gradient-to-br from-red-500 to-pink-500'
                                    }`}>
                                    {response.success ? (
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M5 13l4 4L19 7"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    )}
                                </div>

                                <h3 className={`text-2xl font-bold mb-3 ${
                                    response.success ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {response.success ? "✅ Vérification réussie !" : "❌ Échec de la vérification"}
                                </h3>

                                <p className="text-gray-300 mb-2">
                                    {response.message || (response.success
                                            ? "Votre compte a été activé avec succès."
                                            : "Le lien de vérification est invalide ou a expiré."
                                    )}
                                </p>

                                {response.success && (
                                    <p className="text-gray-400 text-sm">
                                        Redirection vers votre profil...
                                    </p>
                                )}
                            </div>

                            {!response.success && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="btn btn-primary w-full bg-gradient-to-r from-purple-500 to-blue-500 border-none text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        🔄 Réessayer
                                    </button>
                                    <button
                                        onClick={() => router.push('/auth')}
                                        className="btn btn-ghost w-full text-gray-300 hover:text-white border-white/20 hover:bg-white/10 transition-all duration-300"
                                    >
                                        ← Retour à la connexion
                                    </button>
                                </div>
                            )}

                            {response.success && (
                                <div className="flex justify-center space-x-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                                         style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                                         style={{animationDelay: '0.2s'}}></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-gray-500 text-sm">
                    Loup-Garou Online • {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}

export default VerifyPage;