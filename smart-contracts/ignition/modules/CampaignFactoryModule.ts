import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("CampaignFactoryModule", (m) => {
  // Deploy CampaignFactory
  const campaignFactory = m.contract("CampaignFactory");

  return { campaignFactory };
});
