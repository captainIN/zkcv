import React, { useState } from 'react';
import zkeSDK from "@zk-email/sdk";
import Accordion from './Accordian';

const ProfessionalCredentials = ({ onProofGenerated }) => {
    const [proof, setProof] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fileContent, setFileContent] = useState("");
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [isProofOpen, setIsProofOpen] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError("");
        setProof(null);
        setFileContent("");
        setIsEmailOpen(false);
        setIsProofOpen(false);

        try {
            const eml = await file.text();
            setFileContent(eml);

            const sdk = zkeSDK();
            const blueprint = await sdk.getBlueprint("Bisht13/SuccinctZKResidencyInvite@v1");
            const prover = blueprint.createProver();

            const generatedProof = await prover.generateProof(eml);
            const { proofData, publicData } = generatedProof.getProofData();
            handleProofGenerated(proofData, publicData)
            setIsProofOpen(false);
        } catch (error) {
            console.error("Error generating proof:", error);
            setError(error.message || "Failed to verify email. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const handleProofGenerated = (proof, publicData) => {
        setProof(proof);
        if (onProofGenerated) {
            onProofGenerated(proof, publicData);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Verify Email to prove credentials</h2>

            {/* File Upload */}
            <div className="mb-6">
                <label className="block mb-2">
                    <span>Upload Email (.eml file)</span>
                    <input
                        type="file"
                        accept=".eml"
                        onChange={handleFileUpload}
                        disabled={loading}
                        className="mt-1 block w-full text-sm
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-content
                hover:file:bg-primary/90
                disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </label>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="mb-4 text-primary animate-pulse">
                    Generating proof... Please wait.
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-4 bg-error/10 text-error rounded-md">
                    {error}
                </div>
            )}

            {/* Email Content Accordion */}
            {fileContent && (
                <div className="mt-6 space-y-4">
                    <Accordion
                        title="Email Content"
                        isOpen={isEmailOpen}
                        onToggle={() => setIsEmailOpen(!isEmailOpen)}
                    >
                        <div className="max-h-60 overflow-auto">
                            <pre className="text-sm whitespace-pre-wrap text-base-content">
                                {fileContent}
                            </pre>
                        </div>
                    </Accordion>
                </div>
            )}

            {/* Proof Accordion */}
            {proof && (
                <div className="mt-4">
                    <Accordion
                        title="Generated Proof"
                        isOpen={isProofOpen}
                        onToggle={() => setIsProofOpen(!isProofOpen)}
                    >
                        <div className="max-h-60 overflow-auto">
                            <pre className="text-sm text-base-content">
                                {JSON.stringify(proof, null, 2)}
                            </pre>
                        </div>
                    </Accordion>
                </div>
            )}
        </div>
    );
};

export default ProfessionalCredentials;