'use client';

import {useEffect, useState} from 'react';
import {
    AlertCircle,
    CheckCircle,
    ChevronRight,
    Clock,
    Gamepad2,
    Headphones,
    Mail,
    MessageSquare,
    Send,
    Settings,
    Shield,
    User
} from 'lucide-react';

const SupportPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: 'technical',
        message: '',
        urgency: 'medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                subject: '',
                category: 'technical',
                message: '',
                urgency: 'medium'
            });

            setTimeout(() => setSubmitStatus(null), 5000);
        }, 2000);
    };

    const supportCategories = [
        {
            id: 'technical',
            title: 'Problème Technique',
            icon: Settings,
            description: 'Bugs, connexion, performances',
            color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
            iconColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            id: 'gameplay',
            title: 'Question de Gameplay',
            icon: Gamepad2,
            description: 'Règles, stratégies, mécaniques',
            color: 'bg-gradient-to-br from-green-500 to-emerald-500',
            iconColor: 'text-green-600 dark:text-green-400'
        },
        {
            id: 'account',
            title: 'Problème de Compte',
            icon: User,
            description: 'Connexion, mot de passe, profil',
            color: 'bg-gradient-to-br from-purple-500 to-pink-500',
            iconColor: 'text-purple-600 dark:text-purple-400'
        },
        {
            id: 'report',
            title: 'Signaler un Joueur',
            icon: Shield,
            description: 'Comportement abusif, triche',
            color: 'bg-gradient-to-br from-red-500 to-rose-500',
            iconColor: 'text-red-600 dark:text-red-400'
        }
    ];

    const urgencyLevels = [
        {
            value: 'low',
            label: 'Faible',
            description: 'Question générale',
            color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
            borderColor: 'border-green-200 dark:border-green-800'
        },
        {
            value: 'medium',
            label: 'Moyenne',
            description: 'Problème gênant',
            color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
            borderColor: 'border-yellow-200 dark:border-yellow-800'
        },
        {
            value: 'high',
            label: 'Haute',
            description: 'Impossible de jouer',
            color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
            borderColor: 'border-orange-200 dark:border-orange-800'
        },
        {
            value: 'critical',
            label: 'Critique',
            description: 'Sécurité/compte',
            color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
            borderColor: 'border-red-200 dark:border-red-800'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                        <Mail className="w-8 h-8 text-white"/>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Contactez-nous
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Notre équipe de support est là pour vous aider. Remplissez le formulaire ci-dessous
                        et nous vous répondrons dans les plus brefs délais.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <div
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Settings className="w-5 h-5"/>
                                    Type de demande
                                </h2>
                                <div className="space-y-3">
                                    {supportCategories.map(category => {
                                        const Icon = category.icon;
                                        const isSelected = formData.category === category.id;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setFormData(prev => ({...prev, category: category.id}))}
                                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group hover:scale-[1.02] ${
                                                    isSelected
                                                        ? `${category.color} border-transparent text-white shadow-lg`
                                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`p-3 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-white dark:bg-gray-700'}`}>
                                                        <Icon
                                                            className={`w-6 h-6 ${isSelected ? 'text-white' : category.iconColor}`}/>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold">{category.title}</div>
                                                        <div
                                                            className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                                            {category.description}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <ChevronRight className="w-5 h-5 text-white/80"/>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div
                                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            Temps de réponse
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Généralement en moins de 24 heures
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                        <Headphones className="w-5 h-5 text-green-600 dark:text-green-400"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            Support disponible
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            7 jours sur 7
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                            <div
                                className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Formulaire de contact
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Tous les champs sont obligatoires
                                        </p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div
                                            className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                            {supportCategories.find(c => c.id === formData.category)?.title}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {submitStatus === 'success' && (
                                    <div
                                        className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle
                                                className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0"/>
                                            <div>
                                                <h3 className="font-semibold text-green-800 dark:text-green-300">
                                                    Message envoyé avec succès !
                                                </h3>
                                                <p className="text-green-700 dark:text-green-400 text-sm">
                                                    Notre équipe vous répondra dans les 24 heures.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <User className="w-5 h-5 text-gray-500"/>
                                            Informations personnelles
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Nom complet
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                    placeholder="Votre nom"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Adresse email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                    placeholder="votre@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    Sujet du message
                                                </h3>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                                                    placeholder="Décrivez brièvement votre problème..."
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                Niveau d'urgence
                                            </h3>
                                            <div className="space-y-2">
                                                {urgencyLevels.map(level => (
                                                    <label
                                                        key={level.value}
                                                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                                                            formData.urgency === level.value
                                                                ? `${level.color} ${level.borderColor} ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400`
                                                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="urgency"
                                                            value={level.value}
                                                            checked={formData.urgency === level.value}
                                                            onChange={handleInputChange}
                                                            className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 dark:text-white">
                                                                {level.label}
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                {level.description}
                                                            </div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-gray-500"/>
                                            Décrivez votre problème
                                        </h3>
                                        <div className="relative">
                                                                <textarea
                                                                    name="message"
                                                                    value={formData.message}
                                                                    onChange={handleInputChange}
                                                                    rows={8}
                                                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                                                                    placeholder="Décrivez votre problème en détail. Incluez les étapes pour reproduire le problème, les messages d'erreur, et toute autre information utile..."
                                                                    required
                                                                />
                                            <div
                                                className="absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400">
                                                Minimum 50 caractères
                                            </div>
                                        </div>
                                        <div
                                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <AlertCircle className="w-4 h-4"/>
                                            <span>Inclure des captures d'écran aide beaucoup notre équipe</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || formData.message.length < 50}
                                            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                                                isSubmitting || formData.message.length < 50
                                                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl hover:scale-[1.02]'
                                            }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div
                                                        className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    <span>Envoi en cours...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5"/>
                                                    <span>Envoyer la demande de support</span>
                                                </>
                                            )}
                                        </button>
                                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                                            En cliquant, vous acceptez nos conditions de traitement des données
                                        </p>
                                    </div>
                                </form>
                            </div>

                            <div
                                className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Équipe de support connectée
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-blue-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
                        Pour une réponse plus rapide
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">📝 Soignez la description</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Plus votre description est détaillée, plus nous pourrons vous aider rapidement.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">📸 Fournissez des captures</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Les captures d'écran et vidéos aident à comprendre le problème plus vite.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">⏱️ Choisissez la bonne
                                urgence</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Cela nous aide à prioriser les demandes selon leur importance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;