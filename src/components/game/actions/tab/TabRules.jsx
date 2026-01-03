import {Moon, NotebookText, Shield, Sun, Swords, Trophy, Users} from "lucide-react";

const TabRules = () => {
    return (
        <div className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <NotebookText className="w-6 h-6 text-purple-600 dark:text-purple-400"/>
                    </div>
                    <h2 className="card-title text-2xl text-gray-900 dark:text-white">
                        Règles de la partie
                    </h2>
                </div>

                <div className="space-y-8">
                    <div
                        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                                <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                Phase de Nuit
                            </h3>
                        </div>
                        <ul className="space-y-3 text-blue-800 dark:text-blue-200">
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-blue-900 dark:text-blue-100">Cupidon</strong> : Lie deux joueurs en tant qu'amoureux</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-blue-900 dark:text-blue-100">Voyante</strong> : Peut découvrir le rôle d'un joueur</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-blue-900 dark:text-blue-100">Salvateur</strong> : Peut soigner un joueur des griffes des loups</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-blue-900 dark:text-blue-100">Renard</strong> : Peut flairer deux joueurs pour détecter s'ils sont loups</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-blue-900 dark:text-blue-100">Enfant Sauvage</strong> : Doit choisir un modèle à imiter</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-blue-900 dark:text-blue-100">Loups-Garous</strong> : Choisissent une victime à éliminer</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-blue-900 dark:text-blue-100">Loup-Garou Blanc</strong> : Choisis une victime à éliminer</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-blue-900 dark:text-blue-100">Sorcière</strong> : Peut utiliser ses potions de vie ou de mort</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-blue-900 dark:text-blue-100">Voleur</strong> : Peut échanger son rôle avec une carte non distribuée</span>
                            </li>
                        </ul>
                    </div>

                    <div
                        className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 dark:bg-orange-800/30 rounded-lg">
                                <Sun className="w-5 h-5 text-orange-600 dark:text-orange-400"/>
                            </div>
                            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100">
                                Phase de Jour
                            </h3>
                        </div>
                        <ul className="space-y-3 text-orange-800 dark:text-orange-200">
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-orange-900 dark:text-orange-100">Discussion</strong> : Débats et accusations entre joueurs</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-orange-900 dark:text-orange-100">Vote</strong> : Majorité requise pour éliminer un suspect</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-orange-900 dark:text-orange-100">Révélation</strong> : Le rôle du joueur éliminé est dévoilé</span>
                            </li>
                        </ul>
                    </div>

                    <div
                        className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-lg">
                                <Trophy className="w-5 h-5 text-green-600 dark:text-green-400"/>
                            </div>
                            <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                                Conditions de victoire
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                className="bg-white dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 bg-green-100 dark:bg-green-800/30 rounded">
                                        <Shield className="w-4 h-4 text-green-600 dark:text-green-400"/>
                                    </div>
                                    <h4 className="font-bold text-green-800 dark:text-green-300 text-lg">
                                        Villageois
                                    </h4>
                                </div>
                                <p className="text-green-700 dark:text-green-400 text-sm">
                                    Éliminer tous les Loups-Garous pour gagner la partie
                                </p>
                            </div>

                            <div
                                className="bg-white dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 bg-red-100 dark:bg-red-800/30 rounded">
                                        <Swords className="w-4 h-4 text-red-600 dark:text-red-400"/>
                                    </div>
                                    <h4 className="font-bold text-red-800 dark:text-red-300 text-lg">
                                        Loups-Garous
                                    </h4>
                                </div>
                                <p className="text-red-700 dark:text-red-400 text-sm">
                                    Atteindre l'égalité numérique avec les Villageois
                                </p>
                            </div>

                            <div
                                className="bg-white dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 col-span-1 md:col-span-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 bg-pink-100 dark:bg-pink-800/30 rounded">
                                        <Users className="w-4 h-4 text-pink-600 dark:text-pink-400"/>
                                    </div>
                                    <h4 className="font-bold text-pink-800 dark:text-pink-300 text-lg">
                                        Amoureux
                                    </h4>
                                </div>
                                <p className="text-pink-700 dark:text-pink-400 text-sm">
                                    Vivre jusqu'à la fin de la partie, quel que soit le camp
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
                                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400"/>
                            </div>
                            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                                Conseils stratégiques
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-800 dark:text-purple-200">
                            <div className="space-y-2">
                                <p className="text-sm"><strong>Pour les Villageois :</strong></p>
                                <ul className="space-y-1 text-sm">
                                    <li>• Observez les comportements suspects</li>
                                    <li>• Protégez les rôles spéciaux</li>
                                    <li>• Évitez les votes précipités</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm"><strong>Pour les Loups-Garous :</strong></p>
                                <ul className="space-y-1 text-sm">
                                    <li>• Faites diversion en journée</li>
                                    <li>• Ciblez les rôles importants</li>
                                    <li>• Coordonnez vos accusations</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TabRules;