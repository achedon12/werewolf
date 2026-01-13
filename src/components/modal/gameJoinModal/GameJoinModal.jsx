import {useEffect, useState} from "react";
import {Hash, Users, X} from "lucide-react";
import {toast} from "react-toastify";
import {useSearchParams, useRouter} from "next/navigation";
import {useAuth} from "@/app/AuthProvider.jsx";
import Link from "next/link";

const GameJoinModal = ({show, setShow}) => {

    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();
    const auth = useAuth();
    const searchParams = useSearchParams();

    useEffect(() => {
        const gameParam = searchParams.get('gameId');
        if (gameParam) {
            setRoomId(gameParam);
            setShow(true);
        }
    }, []);

    useEffect(() => {
        const gameParam = searchParams.get('gameId');
        if (gameParam) {
            setRoomId(gameParam);
        }
    }, [show]);

    if (!show) return null;

    const handleJoinById = async () => {
        if (!auth.user) {
            toast.error("Vous devez être connecté pour rejoindre une partie.");
            router.push('/auth');
            return;
        }
        if (!roomId.trim()) {
            setError("Veuillez entrer un ID de salle.");
            return;
        }
        setError(null);
        try {
            const res = await fetch(`/api/game/${roomId.trim()}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            if (res.ok) {
                setShow(false);
                setRoomId('');
                router.push(`/game/${roomId.trim()}`);
            } else {
                setError("Aucune partie trouvée avec cet ID.");
            }
        } catch {
            setError("Erreur lors de la vérification de la salle.");
        }
    };

    const handleJoinRandom = async () => {
        if (!auth.user) {
            toast.error("Vous devez être connecté pour rejoindre une partie.");
            router.push('/auth');
            return;
        }
        setError(null);
        try {
            const res = await fetch('/api/game/list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            const data = await res.json();
            const game = data.games?.find(g => g.state === 'En attente');
            if (game) {
                setShow(false);
                router.push(`/game/${game.id}`);
            } else {
                setError("Aucune partie disponible pour rejoindre.");
            }
        } catch {
            setError("Erreur lors de la recherche de partie.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-md mx-4 relative border border-gray-200 dark:border-gray-700">
                <button
                    className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => {
                        setShow(false);
                        setError(null);
                        setRoomId('');
                    }}
                    aria-label="Fermer"
                >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                </button>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Rejoindre une
                        partie</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Entrez un code de partie ou rejoignez une partie aléatoire
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Code de la partie
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Hash
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <input
                                    type="text"
                                    className="pl-10 pr-4 py-3 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                    value={roomId}
                                    onChange={e => setRoomId(e.target.value)}
                                    placeholder="ex: ABC123"
                                    onKeyDown={(e) => e.key === 'Enter' && handleJoinById()}
                                />
                            </div>
                            <button
                                className="btn bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6"
                                onClick={handleJoinById}
                            >
                                Rejoindre
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                                    <span
                                        className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">ou</span>
                        </div>
                    </div>

                    <button
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                        onClick={handleJoinRandom}
                    >
                        <Users className="w-4 h-4"/>
                        Rejoindre une partie aléatoire
                    </button>

                    {error && (
                        <div
                            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            Besoin d'aide ? <Link href="/faq"
                                                  className="text-blue-600 dark:text-blue-400 hover:underline">Consultez
                            la FAQ</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default  GameJoinModal;