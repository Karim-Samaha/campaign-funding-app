// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Campaign.sol";

contract CampaignFactory {
    struct CampaignInfo {
        string name;
        string description;
        uint256 minimum;
        address campaignAddress;
        address manager;
        uint256 createdAt;
    }

    CampaignInfo[] public deployedCampaigns;

    function createCampaign(string memory name, string memory description, uint256 minimum) public {
        Campaign newCampaign = new Campaign(msg.sender, minimum);
        deployedCampaigns.push(
            CampaignInfo({
                name: name,
                description: description,
                minimum: minimum,
                campaignAddress: address(newCampaign),
                manager: msg.sender,
                createdAt: block.timestamp
            })
        );
    }

    function getDeployedCampaigns() public view returns (CampaignInfo[] memory) {
        return deployedCampaigns;
    }
}
