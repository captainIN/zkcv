import { useEffect, useState } from "react";
import ProfessionalCredentials from "./ProfessionalCredentials";
import { useAnonAadhaar } from "@anon-aadhaar/react";
import axios from "axios";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Plus } from "lucide-react";
import ExperienceCard from "./ExperienceCard";
import abi from "~~/abi.json"
import { polygonZkEvmCardona } from "viem/chains";
import toast from "react-hot-toast";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ABI = abi;

const uploadToPinata = async data => {
    try {
        const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            },
        });
        console.log({ response })
        return response.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        throw error;
    }
};

const CVManagement = () => {
    const [anonAadhaar] = useAnonAadhaar();
    const { address } = useAccount();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentExperience, setCurrentExperience] = useState({
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        emailProofCID: "",
    });
    const [experiences, setExperiences] = useState([]);

    const { data: profile } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "getPublicProfile",
        args: [address],
        query: {
            enabled: !!address,
        },
    });
    const { writeContractAsync } = useWriteContract();

    useEffect(() => {
        const fetchExperiences = async () => {
            if (profile && profile[1]) {
                try {
                    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${profile[1]}`);
                    setExperiences(response.data);
                } catch (err) {
                    console.error("Error fetching experiences:", err);
                }
            }
        };

        fetchExperiences();
    }, [profile]);

    const handleAddExperience = async () => {
        if (!currentExperience.company || !currentExperience.title || !currentExperience.emailProofCID) return;

        const finalExperiences = [...experiences, currentExperience];
        try {
            const ipfsHash = await uploadToPinata(finalExperiences);

            await writeContractAsync({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: ABI,
                functionName: "updateCV",
                args: [ipfsHash],
                chain: polygonZkEvmCardona,
                account: address
            });
            setExperiences(finalExperiences);
            setCurrentExperience({
                company: "",
                title: "",
                startDate: "",
                endDate: "",
                description: "",
                emailProofCID: "",
            });
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error:", error);
            toast.error(
                <div style={{
                    maxHeight: '150px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                }}>
                    {JSON.stringify(error, null, 2)}
                </div>
            );
        }
    };

    if (anonAadhaar.status !== "logged-in") {
        return (
            <div className="alert alert-warning max-w-2xl mx-auto mt-8">
                Please verify your Aadhaar first using the verification component above
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-8 w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Experience</h1>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="btn btn-primary btn-sm"
                >
                    {/* @ts-ignore */}
                    <Plus className="h-4 w-4" />
                    Add Experience
                </button>
            </div>

            {isFormOpen && (
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Add Experience</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Company"
                                className="input input-bordered w-full"
                                value={currentExperience.company}
                                onChange={e => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Title"
                                className="input input-bordered w-full"
                                value={currentExperience.title}
                                onChange={e => setCurrentExperience({ ...currentExperience, title: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={currentExperience.startDate}
                                    onChange={e => setCurrentExperience({ ...currentExperience, startDate: e.target.value })}
                                />
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={currentExperience.endDate}
                                    onChange={e => setCurrentExperience({ ...currentExperience, endDate: e.target.value })}
                                />
                            </div>
                            <textarea
                                placeholder="Description"
                                className="textarea textarea-bordered w-full"
                                value={currentExperience.description}
                                onChange={e => setCurrentExperience({ ...currentExperience, description: e.target.value })}
                            />
                            <ProfessionalCredentials
                                onProofGenerated={(proof, publicData) => {
                                    setCurrentExperience({ ...currentExperience, emailProofCID: JSON.stringify({ proof, publicData }) });
                                }}
                            />
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddExperience}
                                    className="btn btn-primary"
                                    disabled={!currentExperience.company || !currentExperience.title || !currentExperience.emailProofCID}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {experiences.length === 0 ? (
                <div className="text-center py-12 bg-base-200 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">No experience added yet</h3>
                    <p className="text-base-content/60">Add your professional experience to get started</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {experiences.map((exp, index) => (
                        <ExperienceCard
                            key={index}
                            title={exp.title}
                            company={exp.company}
                            startDate={exp.startDate}
                            endDate={exp.endDate}
                            description={exp.description}
                            proofJSON={exp.emailProofCID}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CVManagement;