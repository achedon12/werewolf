'use client';
import {useActionState, useState, useEffect} from 'react';
import {useAuth} from '@/app/AuthProvider';

const AuthPage = () => {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [registerData, setRegisterData] = useState({
        name: '',
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [state, setState] = useState({});

    useEffect(() => {
        if (state?.success) {
            const timer = setTimeout(() => {
                window.location.href = '/auth/profile';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [state?.success]);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleLogin = async (e) => {
        e.preventDefault();
        const ok = await login(loginData.email, loginData.password);
        setState(ok ? { success: true, message: 'Connexion réussie!' } : { error: 'Email ou mot de passe incorrect' });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            setState({ error: 'Les mots de passe ne correspondent pas' });
            return;
        }
        const ok = await register(registerData.email, registerData.password, registerData.name, registerData.nickname);
        setState(ok ? { success: true, message: 'Compte créé avec succès!' } : { error: 'Erreur lors de l\'inscription' });
    };

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
                            <span className="text-2xl">🐺</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Loup-Garou
                        </h1>
                        <p className="text-gray-400 mt-2">
                            {isLogin ? 'Content de vous revoir !' : 'Rejoignez la meute !'}
                        </p>
                    </div>

                    <div className="flex bg-base-200/50 rounded-2xl p-1 mb-8 backdrop-blur-sm">
                        <button
                            className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                                isLogin
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg transform scale-105'
                                    : 'hover:bg-white/10'
                            }`}
                            onClick={() => {
                                setIsLogin(true);
                                setCurrentStep(1);
                            }}
                        >
                            <span className={`font-semibold ${isLogin ? 'text-white' : 'text-gray-400'}`}>
                                Connexion
                            </span>
                        </button>
                        <button
                            className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                                !isLogin
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg transform scale-105'
                                    : 'hover:bg-white/10'
                            }`}
                            onClick={() => {
                                setIsLogin(false);
                                setCurrentStep(1);
                            }}
                        >
                            <span className={`font-semibold ${!isLogin ? 'text-white' : 'text-gray-400'}`}>
                                Inscription
                            </span>
                        </button>
                    </div>

                    {state?.success ? (
                        <div className="text-center py-8">
                            <div
                                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                                <span className="text-3xl">🎉</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{state.message}</h3>
                            <p className="text-gray-400">Redirection en cours...</p>
                        </div>
                    ) : (
                        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
                            {isLogin && (
                                <div className="space-y-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-gray-300 font-medium">Email</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="votre@email.com"
                                                className="input input-lg w-full bg-base-200/50 border-white/20 backdrop-blur-sm pl-12 transition-all duration-300 focus:bg-base-200/80 focus:border-purple-400"
                                                required
                                                value={loginData.email}
                                                onChange={e => setLoginData({
                                                    ...loginData,
                                                    email: e.target.value
                                                })}
                                            />
                                            <div
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-gray-300 font-medium">Mot de passe</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Votre mot de passe"
                                                className="input input-lg w-full bg-base-200/50 border-white/20 backdrop-blur-sm pl-12 transition-all duration-300 focus:bg-base-200/80 focus:border-purple-400"
                                                required
                                                value={loginData.password}
                                                onChange={e => setLoginData({
                                                    ...loginData,
                                                    password: e.target.value
                                                })}
                                            />
                                            <div
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-control mt-8">
                                        <button
                                            type="submit"
                                            className="btn btn-lg w-full bg-gradient-to-r from-purple-500 to-blue-500 border-none text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                        >
                                            <span className="font-semibold">Se connecter</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!isLogin && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-8 px-4">
                                        {[1, 2, 3].map((step) => (
                                            <div key={step} className="flex flex-col items-center">
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                        currentStep >= step
                                                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                                                            : 'bg-base-200/50 text-gray-400'
                                                    }`}>
                                                    {currentStep > step ? (
                                                        <svg className="w-5 h-5" fill="currentColor"
                                                             viewBox="0 0 20 20">
                                                            <path fillRule="evenodd"
                                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    ) : (
                                                        <span className="font-semibold">{step}</span>
                                                    )}
                                                </div>
                                                <span className={`text-xs mt-2 font-medium ${
                                                    currentStep >= step ? 'text-white' : 'text-gray-400'
                                                }`}>
                                                    {step === 1 ? 'Infos' : step === 2 ? 'Compte' : 'Finaliser'}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="absolute top-28 left-8 right-8 h-1 bg-base-200/50 -z-10">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                                                style={{width: `${((currentStep - 1) / 2) * 100}%`}}
                                            ></div>
                                        </div>
                                    </div>

                                    {currentStep === 1 && (
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-xl text-white text-center mb-2">Qui êtes-vous
                                                ?</h3>
                                            <p className="text-gray-400 text-center text-sm mb-6">
                                                Créez votre identité de joueur
                                            </p>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span
                                                        className="label-text text-gray-300 font-medium">Nom complet</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        placeholder="Votre nom"
                                                        className="input input-lg w-full bg-base-200/50 border-white/20 backdrop-blur-sm pl-12 transition-all duration-300 focus:bg-base-200/80 focus:border-purple-400"
                                                        required
                                                        value={registerData.name}
                                                        onChange={e => setRegisterData({
                                                            ...registerData,
                                                            name: e.target.value
                                                        })}
                                                    />
                                                    <div
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                             viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text text-gray-300 font-medium">Pseudo</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="nickname"
                                                        placeholder="Votre pseudo de jeu"
                                                        className="input input-lg w-full bg-base-200/50 border-white/20 backdrop-blur-sm pl-12 transition-all duration-300 focus:bg-base-200/80 focus:border-purple-400"
                                                        required
                                                        value={registerData.nickname}
                                                        onChange={e => setRegisterData({
                                                            ...registerData,
                                                            nickname: e.target.value
                                                        })}
                                                    />
                                                    <div
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                             viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="label-text-alt text-gray-400 mt-2">Ce pseudo sera visible par les autres joueurs</p>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-lg w-full bg-gradient-to-r from-purple-500 to-blue-500 border-none text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-4"
                                                onClick={nextStep}
                                            >
                                                Continuer
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 5l7 7-7 7"/>
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-xl text-white text-center mb-2">Votre
                                                compte</h3>
                                            <p className="text-gray-400 text-center text-sm mb-6">
                                                Sécurisez votre accès
                                            </p>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text text-gray-300 font-medium">Email</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="votre@email.com"
                                                        className="input input-lg w-full bg-base-200/50 border-white/20 backdrop-blur-sm pl-12 transition-all duration-300 focus:bg-base-200/80 focus:border-purple-400"
                                                        required
                                                        value={registerData.email}
                                                        onChange={e => setRegisterData({
                                                            ...registerData,
                                                            email: e.target.value
                                                        })}
                                                    />
                                                    <div
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                             viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span
                                                        className="label-text text-gray-300 font-medium">Mot de passe</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        placeholder="Minimum 6 caractères"
                                                        className="input input-lg w-full bg-base-200/50 border-white/20 backdrop-blur-sm pl-12 transition-all duration-300 focus:bg-base-200/80 focus:border-purple-400"
                                                        required
                                                        value={registerData.password}
                                                        onChange={e => setRegisterData({
                                                            ...registerData,
                                                            password: e.target.value
                                                        })}
                                                    />
                                                    <div
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                             viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text text-gray-300 font-medium">Confirmer le mot de passe</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        placeholder="Retapez votre mot de passe"
                                                        className="input input-lg w-full bg-base-200/50 border-white/20 backdrop-blur-sm pl-12 transition-all duration-300 focus:bg-base-200/80 focus:border-purple-400"
                                                        required
                                                        value={registerData.confirmPassword}
                                                        onChange={e => setRegisterData({
                                                            ...registerData,
                                                            confirmPassword: e.target.value
                                                        })}
                                                    />
                                                    <div
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                             viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-3 mt-6">
                                                <button
                                                    type="button"
                                                    className="btn btn-lg flex-1 bg-base-200/50 border-white/20 text-gray-300 hover:bg-base-200/80 transition-all duration-300 p-2 md:p-0"
                                                    onClick={prevStep}
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2} d="M15 19l-7-7 7-7"/>
                                                    </svg>
                                                    Retour
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-lg flex-1 bg-gradient-to-r from-purple-500 to-blue-500 border-none text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-2 md:p-0"
                                                    onClick={nextStep}
                                                >
                                                    Continuer
                                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2} d="M9 5l7 7-7 7"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div className="space-y-6">
                                            <input type="hidden" name="name" value={registerData.name} />
                                            <input type="hidden" name="nickname" value={registerData.nickname} />
                                            <input type="hidden" name="email" value={registerData.email} />
                                            <input type="hidden" name="password" value={registerData.password} />
                                            <input type="hidden" name="confirmPassword" value={registerData.confirmPassword} />

                                            <h3 className="font-bold text-xl text-white text-center mb-2">Presque
                                                terminé !</h3>

                                            <div
                                                className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm">
                                                <div className="text-center mb-4">
                                                    <div
                                                        className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                                                        <span className="text-2xl">🐺</span>
                                                    </div>
                                                    <p className="text-white font-medium mb-2">
                                                        Bienvenue dans la meute !
                                                    </p>
                                                    <p className="text-gray-400 text-sm">
                                                        Votre aventure dans le monde des Loups-Garous commence
                                                        maintenant
                                                    </p>
                                                </div>

                                                <ul className="space-y-3 text-sm">
                                                    <li className="flex items-center text-gray-300">
                                                        <div
                                                            className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                                                            <svg className="w-3 h-3 text-green-400" fill="currentColor"
                                                                 viewBox="0 0 20 20">
                                                                <path fillRule="evenodd"
                                                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                      clipRule="evenodd"/>
                                                            </svg>
                                                        </div>
                                                        Rejoignez des parties passionnantes
                                                    </li>
                                                    <li className="flex items-center text-gray-300">
                                                        <div
                                                            className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                                                            <svg className="w-3 h-3 text-green-400" fill="currentColor"
                                                                 viewBox="0 0 20 20">
                                                                <path fillRule="evenodd"
                                                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                      clipRule="evenodd"/>
                                                            </svg>
                                                        </div>
                                                        Développez votre stratégie
                                                    </li>
                                                    <li className="flex items-center text-gray-300">
                                                        <div
                                                            className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                                                            <svg className="w-3 h-3 text-green-400" fill="currentColor"
                                                                 viewBox="0 0 20 20">
                                                                <path fillRule="evenodd"
                                                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                      clipRule="evenodd"/>
                                                            </svg>
                                                        </div>
                                                        Grimpez dans le classement
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-3 mt-6">
                                                <button
                                                    type="button"
                                                    className="btn btn-lg flex-1 bg-base-200/50 border-white/20 text-gray-300 hover:bg-base-200/80 transition-all duration-300 p-2 md:p-0"
                                                    onClick={prevStep}
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2} d="M15 19l-7-7 7-7"/>
                                                    </svg>
                                                    Retour
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-lg flex-1 bg-gradient-to-r from-purple-500 to-blue-500 border-none text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-2 md:p-0"
                                                >
                                                    Créer mon compte
                                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {state?.error && (
                                <div
                                    className="alert alert-error bg-red-500/10 border border-red-500/20 text-red-300 mt-6 backdrop-blur-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span>{state.error}</span>
                                </div>
                            )}
                        </form>
                    )}

                    <div className="text-center mt-8 pt-6 border-t border-white/10">
                        {isLogin ? (
                            <p className="text-gray-400">
                                Pas de compte ?{' '}
                                <button
                                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
                                    onClick={() => setIsLogin(false)}
                                >
                                    S'inscrire
                                </button>
                            </p>
                        ) : (
                            <p className="text-gray-400">
                                Déjà un compte ?{' '}
                                <button
                                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
                                    onClick={() => setIsLogin(true)}
                                >
                                    Se connecter
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;