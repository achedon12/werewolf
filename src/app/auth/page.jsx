'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/AuthProvider';
import {
    Mail,
    Lock,
    User,
    Users,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Sparkles,
    Shield,
    Gamepad2,
    Eye,
    EyeOff,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const AuthPage = () => {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [registerData, setRegisterData] = useState({
        name: '',
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [state, setState] = useState({});

    useEffect(() => {
        if (state?.success) {
            const timer = setTimeout(() => {
                window.location.href = '/auth/profile';
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [state?.success]);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleLogin = async (e) => {
        e.preventDefault();
        const ok = await login(loginData.email, loginData.password);
        setState(ok ? {
            success: true,
            message: 'Connexion réussie ! Redirection...'
        } : {
            error: 'Email ou mot de passe incorrect'
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            setState({ error: 'Les mots de passe ne correspondent pas' });
            return;
        }
        if (registerData.password.length < 6) {
            setState({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
            return;
        }

        const ok = await register(
            registerData.email,
            registerData.password,
            registerData.name,
            registerData.nickname
        );

        setState(ok ? {
            success: true,
            message: 'Compte créé avec succès !'
        } : {
            error: 'Cette adresse email est déjà utilisée'
        });
    };

    const registerSteps = [
        { number: 1, title: 'Informations', description: 'Votre identité' },
        { number: 2, title: 'Compte', description: 'Sécurité' },
        { number: 3, title: 'Confirmation', description: 'Finalisation' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="hidden lg:flex flex-col justify-center p-8">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🐺</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loup-Garou</h1>
                                <p className="text-blue-600 dark:text-blue-400 font-medium">Online Edition</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {isLogin ? 'Content de vous revoir !' : 'Rejoignez la meute !'}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            {isLogin
                                ? 'Plongez à nouveau dans le jeu de déduction le plus captivant en ligne'
                                : 'Créez votre compte et commencez votre aventure dans le monde mystérieux des Loups-Garous'
                            }
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">Plus de 5 000 joueurs actifs</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Gamepad2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">Parties en temps réel</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">Plateforme sécurisée</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-12">
                        <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl"></div>
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-xl"></div>
                        <div className="relative p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-400 italic">
                                "Dans l'ombre de la nuit, la vérité se révèle. Mais la lumière appartient à ceux qui savent regarder."
                            </p>
                            <div className="flex items-center gap-2 mt-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">La Voyante</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">Narratrice officielle</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 md:p-8">
                    <div className="flex mb-8 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1">
                        <button
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                                isLogin
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                            onClick={() => {
                                setIsLogin(true);
                                setCurrentStep(1);
                                setState({});
                            }}
                        >
                            Connexion
                        </button>
                        <button
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                                !isLogin
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                            onClick={() => {
                                setIsLogin(false);
                                setCurrentStep(1);
                                setState({});
                            }}
                        >
                            Inscription
                        </button>
                    </div>

                    {state?.success && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-green-800 dark:text-green-300">{state.message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isLogin && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Étape {currentStep} sur 3
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {registerSteps[currentStep - 1]?.title} • {registerSteps[currentStep - 1]?.description}
                                    </p>
                                </div>
                                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    {currentStep}/3
                                </div>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 rounded-full"
                                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
                        {isLogin && (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Adresse email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="vous@exemple.com"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                required
                                                value={loginData.email}
                                                onChange={e => setLoginData({
                                                    ...loginData,
                                                    email: e.target.value
                                                })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Mot de passe
                                            </label>
                                            <button
                                                type="button"
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                onClick={() => {
                                                    // TODO: Forgot password functionality
                                                    setState({ error: 'Fonctionnalité en cours de développement' });
                                                }}
                                            >
                                                Mot de passe oublié ?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <Lock className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Votre mot de passe"
                                                className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                required
                                                value={loginData.password}
                                                onChange={e => setLoginData({
                                                    ...loginData,
                                                    password: e.target.value
                                                })}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={loginData.rememberMe}
                                            onChange={e => setLoginData({
                                                ...loginData,
                                                rememberMe: e.target.checked
                                            })}
                                            className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded"
                                        />
                                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            Se souvenir de moi
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Se connecter
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </button>
                            </>
                        )}

                        {!isLogin && (
                            <>
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nom complet
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                    <User className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Jean Dupont"
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                    required
                                                    value={registerData.name}
                                                    onChange={e => setRegisterData({
                                                        ...registerData,
                                                        name: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Pseudo
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                    <Users className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Loupy22"
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                    required
                                                    value={registerData.nickname}
                                                    onChange={e => setRegisterData({
                                                        ...registerData,
                                                        nickname: e.target.value
                                                    })}
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                Ce pseudo sera visible par les autres joueurs
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                Continuer
                                                <ChevronRight className="w-4 h-4" />
                                            </span>
                                        </button>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Adresse email
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                    <Mail className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    placeholder="vous@exemple.com"
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                    required
                                                    value={registerData.email}
                                                    onChange={e => setRegisterData({
                                                        ...registerData,
                                                        email: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Mot de passe
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                    <Lock className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Minimum 6 caractères"
                                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                    required
                                                    value={registerData.password}
                                                    onChange={e => setRegisterData({
                                                        ...registerData,
                                                        password: e.target.value
                                                    })}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Confirmer le mot de passe
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                    <Lock className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Retapez votre mot de passe"
                                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                    required
                                                    value={registerData.confirmPassword}
                                                    onChange={e => setRegisterData({
                                                        ...registerData,
                                                        confirmPassword: e.target.value
                                                    })}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <ChevronLeft className="w-4 h-4" />
                                                    Retour
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    Continuer
                                                    <ChevronRight className="w-4 h-4" />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                                <Sparkles className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                Prêt à rejoindre la meute !
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Votre compte sera créé avec les informations suivantes :
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <span className="text-gray-600 dark:text-gray-400">Pseudo :</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{registerData.nickname}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <span className="text-gray-600 dark:text-gray-400">Email :</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{registerData.email}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                En créant votre compte, vous acceptez nos
                                                <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                                                    conditions d'utilisation
                                                </a> et notre
                                                <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                                                    politique de confidentialité
                                                </a>.
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <ChevronLeft className="w-4 h-4" />
                                                    Retour
                                                </span>
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    Créer mon compte
                                                    <Sparkles className="w-4 h-4" />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </form>

                    {state?.error && (
                        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <p className="text-sm font-medium text-red-800 dark:text-red-300">{state.error}</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                            <button
                                className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setCurrentStep(1);
                                    setState({});
                                }}
                            >
                                {isLogin ? "S'inscrire" : "Se connecter"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;