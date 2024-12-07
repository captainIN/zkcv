// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ZkCV {
    struct UserProfile {
        bool isAadhaarVerified;
        string cvIPFSHash;
        bool exists;
    }

    mapping(address => UserProfile) public userProfiles;

    event AadhaarVerified(address indexed user);
    event CVUpdated(address indexed user, string ipfsHash);

    modifier onlyVerifiedUser() {
        require(userProfiles[msg.sender].isAadhaarVerified, "Aadhaar verification required");
        _;
    }

    function verifyAadhaar() public {
        userProfiles[msg.sender].isAadhaarVerified = true;
        userProfiles[msg.sender].exists = true;
        emit AadhaarVerified(msg.sender);
    }

    function updateCV(string memory ipfsHash) public {
        if (!userProfiles[msg.sender].isAadhaarVerified) {
            userProfiles[msg.sender].isAadhaarVerified = true;
            userProfiles[msg.sender].exists = true;
        }
        userProfiles[msg.sender].cvIPFSHash = ipfsHash;
        emit CVUpdated(msg.sender, ipfsHash);
    }

    function getPublicProfile(address user) public view returns (bool verified, string memory cvIPFSHash) {
        UserProfile memory profile = userProfiles[user];
        return (profile.isAadhaarVerified, profile.cvIPFSHash);
    }
}
