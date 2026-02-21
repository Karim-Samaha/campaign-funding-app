import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("CampaignFactoryModule", (m) => {
  // Deploy CampaignFactory
  const campaign = m.contract("Campaign");

  return { campaign };
});
