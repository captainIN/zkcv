import { LaunchProveModal, useAnonAadhaar } from "@anon-aadhaar/react";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

export const VerifyYourself = () => {
    const [anonAadhaar] = useAnonAadhaar();
    const [isTestMode, setIsTestMode] = useState(true);
    const { targetNetwork } = useTargetNetwork();

    useEffect(() => {
        console.log("Anon Aadhaar status:", anonAadhaar.status);
    }, [anonAadhaar]);

    return (
        <div className="flex flex-col items-center gap-6 bg-base-100 p-8 rounded-2xl shadow-lg">
            <h2 className="text-4xl font-bold">zkCV</h2>
            <p className="text-center text-lg opacity-80 max-w-lg">
                Verify your professional identity privately using zero-knowledge proofs
            </p>

            <ConnectButton.Custom>
                {({ account, chain, openConnectModal, mounted }) => {
                    const connected = mounted && account && chain;
                    const wrongNetwork = chain?.id !== targetNetwork.id;

                    return (
                        <div className="flex flex-col items-center gap-4">
                            {!connected ? (
                                <button className="btn btn-primary" onClick={openConnectModal} type="button">
                                    Connect Wallet
                                </button>
                            ) : wrongNetwork ? (
                                <div className="alert alert-warning">
                                    <span>Please switch to {targetNetwork.name}</span>
                                </div>
                            ) : (
                                <>
                                    {/* Test Mode Toggle */}
                                    <div className="form-control">
                                        <label className="label cursor-pointer gap-4">
                                            <span className="label-text">Test Mode</span>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={isTestMode}
                                                onChange={e => setIsTestMode(e.target.checked)}
                                            />
                                        </label>
                                    </div>

                                    {/* Verification Status */}
                                    {anonAadhaar.status !== "logged-out" && (
                                        <div className={`alert ${anonAadhaar.status === "logged-in" ? "alert-success" : "alert-info"}`}>
                                            <span>
                                                Status: {anonAadhaar.status === "logged-in" ? "Aadhaar Verified" : "anonAadhaar.status"}
                                                {anonAadhaar.status === "logged-in" && " ✅"}
                                            </span>
                                        </div>
                                    )}

                                    {/* Verification Button */}
                                    {anonAadhaar.status != "logged-in" && <LaunchProveModal
                                        nullifierSeed={Math.floor(Math.random() * 1983248)}
                                        signal={account.address}
                                        buttonStyle={{
                                            padding: "1rem 2rem",
                                            borderRadius: "0.5rem",
                                            backgroundColor: "hsl(var(--p))",
                                            color: "hsl(var(--pc))",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                        }}
                                        buttonTitle={isTestMode ? "Verify with Test Aadhaar" : "Verify with Aadhaar"}
                                    />}
                                </>
                            )}
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        </div>
    );
};