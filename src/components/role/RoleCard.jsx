import Image from "next/image";
import {useState} from "react";

const RoleCard = ({roleName, description, imageUrl, team = "Village", nightAction, strategy, additionalInfo}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className="card card-compact bg-base-100 shadow-xl image-full hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <figure className="w-full h-64">
                    <Image
                        src={imageUrl}
                        alt={`Carte du rôle : ${roleName}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        width={300}
                        height={256}
                        priority
                    />
                </figure>

                <div
                    className="card-body opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <h2 className="card-title text-white text-center justify-center text-xl mb-2">
                        {roleName}
                    </h2>
                    <p className="text-white text-center text-sm line-clamp-2">
                        {description}
                    </p>
                    <div className="card-actions justify-center mt-2">
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Voir détails
                        </button>
                    </div>
                </div>

                <div className="absolute top-2 right-2">
                    <div className={`badge ${
                        team.includes('Loup') ? 'badge-error' :
                            team.includes('Village') ? 'badge-success' : 'badge-warning'
                    }`}>
                        {team}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold">{roleName}</h3>
                            <button
                                className="btn btn-sm btn-circle"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <Image
                                    src={imageUrl}
                                    alt={`Carte du rôle : ${roleName}`}
                                    width={200}
                                    height={300}
                                    className="rounded-lg shadow-md"
                                />
                            </div>

                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Équipe :</span>
                                    <span className={`badge ${
                                        team.includes('Loup') ? 'badge-error' :
                                            team.includes('Village') ? 'badge-success' : 'badge-warning'
                                    }`}>
                                    {team}
                                  </span>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Description</h4>
                                    <p className="text-gray-700">{description}</p>
                                </div>

                                {nightAction && (
                                    <div>
                                        <h4 className="font-semibold text-lg mb-2">Action de nuit</h4>
                                        <p className="text-gray-700">{nightAction}</p>
                                    </div>
                                )}

                                {strategy && (
                                    <div>
                                        <h4 className="font-semibold text-lg mb-2">Stratégie</h4>
                                        <p className="text-gray-700">{strategy}</p>
                                    </div>
                                )}

                                {additionalInfo && (
                                    <div>
                                        <h4 className="font-semibold text-lg mb-2">Informations supplémentaires</h4>
                                        <p className="text-gray-700">{additionalInfo}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RoleCard;