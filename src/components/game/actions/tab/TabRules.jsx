import {NotebookText} from "lucide-react";

const TabRules = () => {
    return (
        <div className="card glass shadow-2xl backdrop-blur-sm border border-white/10">
            <div className="card-body">
                <h2 className="card-title text-2xl text-white mb-6">
                    <NotebookText className="inline mr-2 h-6 w-6"/>
                    Règles de la partie
                </h2>
                <div className="prose prose-invert max-w-none">
                    <h3 className="text-white">Phase de Nuit</h3>
                    <ul className="text-gray-300">
                        <li>Les Loups-Garous choisissent une victime</li>
                        <li>La Voyante peut découvrir un rôle</li>
                        <li>Le Docteur peut soigner un joueur</li>
                        <li>La Sorcière peut utiliser ses potions</li>
                    </ul>

                    <h3 className="text-white mt-6">Phase de Jour</h3>
                    <ul className="text-gray-300">
                        <li>Discussion et accusations</li>
                        <li>Vote pour éliminer un suspect</li>
                        <li>Révélation du rôle de l'éliminé</li>
                    </ul>

                    <h3 className="text-white mt-6">Conditions de victoire</h3>
                    <ul className="text-gray-300">
                        <li>Villageois: Éliminer tous les Loups-Garous</li>
                        <li>Loups-Garous: Être en égalité numérique avec les Villageois</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TabRules;