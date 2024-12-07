"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { createPublicClient, http, getContract, parseAbiItem } from "viem";
import { useParams } from "next/navigation";
import ExperienceCard from "~~/components/ExperienceCard";
import abi from "~~/abi.json"
import { polygonZkEvmCardona } from "viem/chains";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ABI = abi;

const PublicProfile = () => {
    const params = useParams<{ slug: string }>();
    const [experiences, setExperiences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const address = params.slug;

    useEffect(() => {
        const fetchProfile = async () => {
            if (!address) return;

            try {
                setLoading(true);
                const client = createPublicClient({
                    chain: process.env.NEXT_PUBLIC_IS_LOCAL === "false" ? polygonZkEvmCardona : {
                        id: 31337,
                        name: 'Local Chain',
                        network: 'localhost',
                        nativeCurrency: {
                            decimals: 18,
                            name: 'Ether',
                            symbol: 'ETH',
                        },
                        rpcUrls: {
                            default: { http: ['http://127.0.0.1:8545'] },
                            public: { http: ['http://127.0.0.1:8545'] }
                        }
                    },
                    transport: http()
                });
                // @ts-ignore
                const result = await client.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: ABI,
                    functionName: 'getPublicProfile',
                    args: [address as `0x${string}`]
                });
                // @ts-ignore
                const [verified, ipfsHash] = result;

                if (verified && ipfsHash) {
                    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
                    setExperiences(response.data);
                }
            } catch (err) {
                setError("Failed to load profile");
                console.error("fetchProfile error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [address]);

    // Rest of the component remains the same
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-8 w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">ZK Verified Credentials of</h1>
                    <p className="text-base-content/60">{address}</p>
                </div>
            </div>

            {experiences.length === 0 ? (
                <div className="text-center py-12 bg-base-200 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">No experience found</h3>
                    <p className="text-base-content/60">This profile hasn&apos;t added any experience yet</p>
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

export default PublicProfile;