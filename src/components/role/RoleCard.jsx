import Image from "next/image";
import {useState} from "react";
import {Info, Moon, Shield, Sword, Users, X, Zap} from "lucide-react";

const RoleCard = ({roleName, description, imageUrl, team = "Village", nightAction, strategy, additionalInfo}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const teamConfig = {
        'Loup': {
            badge: 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
            border: 'border-red-200 dark:border-red-800',
            bg: 'bg-red-50 dark:bg-red-900/20',
            icon: <Sword className="w-4 h-4"/>,
            text: 'text-red-700 dark:text-red-300'
        },
        'Village': {
            badge: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
            border: 'border-green-200 dark:border-green-800',
            bg: 'bg-green-50 dark:bg-green-900/20',
            icon: <Shield className="w-4 h-4"/>,
            text: 'text-green-700 dark:text-green-300'
        },
        'Spécial': {
            badge: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white',
            border: 'border-yellow-200 dark:border-yellow-800',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            icon: <Zap className="w-4 h-4"/>,
            text: 'text-yellow-700 dark:text-yellow-300'
        }
    };

    const config = team.includes('Loup') ? teamConfig['Loup'] :
        team.includes('Village') ? teamConfig['Village'] :
            teamConfig['Spécial'];

    return (
        <>
            <div
                role="button"
                tabIndex={0}
                onClick={() => setIsModalOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setIsModalOpen(true);
                }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
            >
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={`Carte du rôle : ${roleName}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        width={300}
                        height={192}
                        priority
                    />

                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

                    <div
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${config.badge}`}>
                        <div className="flex items-center gap-1">
                            {config.icon}
                            {team}
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-1">
                        {roleName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                        {description}
                    </p>

                    <button
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                        }}
                    >
                        <Info className="w-4 h-4"/>
                        Voir les détails
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <Image
                                src={imageUrl}
                                alt={`Carte du rôle : ${roleName}`}
                                width={800}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors"
                            >
                                <X className="w-5 h-5"/>
                            </button>

                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">
                                        {roleName}
                                    </h2>
                                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${config.badge}`}>
                                        <div className="flex items-center gap-1">
                                            {config.icon}
                                            {team}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-500"/>
                                        Description du rôle
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {description}
                                    </p>
                                </div>

                                {nightAction && (
                                    <div className={config.bg + " rounded-xl p-4 border " + config.border}>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Moon className="w-5 h-5 text-blue-500"/>
                                            Action de nuit
                                        </h3>
                                        <p className={config.text + " leading-relaxed"}>
                                            {nightAction}
                                        </p>
                                    </div>
                                )}

                                {strategy && (
                                    <div
                                        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-blue-500"/>
                                            Stratégie recommandée
                                        </h3>
                                        <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                                            {strategy}
                                        </p>
                                    </div>
                                )}

                                {additionalInfo && (
                                    <div
                                        className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-purple-500"/>
                                            Informations supplémentaires
                                        </h3>
                                        <p className="text-purple-700 dark:text-purple-300 leading-relaxed">
                                            {additionalInfo}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div
                            className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RoleCard;