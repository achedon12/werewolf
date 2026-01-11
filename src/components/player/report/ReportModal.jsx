import {useRef, useState} from 'react';
import {AlertTriangle, X, User, Flag, MessageSquare} from 'lucide-react';
import Image from 'next/image';
import {useAuth} from "@/app/AuthProvider.jsx";
import {toast} from "react-toastify";

const ReportModal = ({onClose, player}) => {

    const [reason, setReason] = useState(null);
    const [details, setDetails] = useState('');
    const [sending, setSending] = useState(false);
    const modalRef = useRef(null);
    const {user} = useAuth();

    const reportReasons = [
        {id: 'cheating', label: 'Triche', description: 'Utilisation de logiciels tiers ou coordination externe'},
        {id: 'harassment', label: 'Harcèlement', description: 'Messages insultants, menaces ou comportement toxique'},
        {id: 'spamming', label: 'Spam', description: 'Messages répétitifs perturbant le jeu'},
        {id: 'afk', label: 'AFK prolongé', description: 'Absent pendant une longue période'},
        {id: 'exploit', label: 'Exploit de bug', description: 'Utilisation abusive de failles techniques'},
        {id: 'other', label: 'Autre', description: 'Autre comportement inapproprié'}
    ];

    const handleSubmit = async () => {
        try {
            setSending(true);

            const response = await fetch('/api/user/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reportedUserId: player.id,
                    reporterUserId: user.id,
                    reason: reason.label,
                    details,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onClose();
                toast.success('Signalement envoyé avec succès. Merci de votre aide !');
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            toast.error(`Erreur lors de l'envoi du signalement : ${error.message}`);
        } finally {
            setSending(false);
        }
    }

    if (!player) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="relative w-full max-w-2xl h-1/2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-2xl overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Signaler un joueur
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Aidez-nous à maintenir un environnement de jeu sain
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                        </button>
                    </div>

                    <div
                        className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div
                                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-300 dark:border-red-700">
                                    <Image
                                        src={player.isBot ? '/bot-avatar.png' : player.avatar ? player.avatar : "/default-avatar.png"}
                                        alt={player.nickname}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                {player.nickname}
                                            </span>
                                    {player.isBot && (
                                        <span
                                            className="badge bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                    Bot
                                                </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                                <Flag className="w-4 h-4 inline mr-2"/>
                                Motif du signalement
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {reportReasons.map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => setReason(r)}
                                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                                            reason?.id === r.id
                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                                : 'border-gray-300 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:bg-gray-50 dark:hover:bg-gray-900'
                                        }`}
                                    >
                                        <div className="font-medium text-sm mb-1">{r.label}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            {r.description}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                <MessageSquare className="w-4 h-4 inline mr-2"/>
                                Description (optionnelle)
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Décrivez brièvement l'incident (ce que le joueur a fait, quand, etc.)"
                                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                rows={3}
                                maxLength={500}
                            />
                            <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {details.length}/500 caractères
                            </div>
                        </div>

                        <div
                            className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5"/>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    Les signalements abusifs peuvent entraîner des sanctions.
                                    Les modérateurs examineront votre rapport sous 24h.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!reason || sending}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <div
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Envoi...</span>
                                    </>
                                ) : (
                                    <>
                                        <Flag className="w-4 h-4"/>
                                        <span>Envoyer le signalement</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportModal;