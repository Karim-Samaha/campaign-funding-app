import { expect } from "chai";
import { Signer } from "ethers";
import { network } from "hardhat";
import { Campaign } from "../types/ethers-contracts/Campaign.js";
const { ethers } = await network.connect();
let Campaign: any;
let CampaignFactory: any
let accounts: Signer[];
let Manager: any;


beforeEach(async function () {
    accounts = await ethers.getSigners();
    Manager = accounts[0];

    // Deploy factory and create a campaign
    const CampaignFactoryFactory = await ethers.getContractFactory("CampaignFactory");
    CampaignFactory = await CampaignFactoryFactory.deploy();
    await CampaignFactory.waitForDeployment();

    await CampaignFactory.createCampaign("Test Campaign", "Test Description", 100);
    const deployedCampaigns = await CampaignFactory.getDeployedCampaigns();
    const campaignAddress = deployedCampaigns[0].campaignAddress;

    // Get the Campaign contract instance
    const CampaignFactoryContract = await ethers.getContractFactory("Campaign");
    Campaign = CampaignFactoryContract.attach(campaignAddress);
});
describe("Campain", function () {
    it("should be deployed", function () {
        expect(Campaign.target).to.be.ok;
    });
    it("should create a new campaign", async function () {
        expect(await CampaignFactory.createCampaign("Campaign 2", "Description 2", 100)).to.be.ok;
        expect(await CampaignFactory.createCampaign("Campaign 3", "Description 3", 50)).to.be.ok;
        const deployedCampaigns = await CampaignFactory.getDeployedCampaigns();
        expect(deployedCampaigns.length).to.be.equal(3);
    });

    it("allow users to contribute to a campaign", async function () {
        await Campaign.connect(accounts[0]).contribute({ value: ethers.parseEther("1") });
        await Campaign.connect(accounts[1]).contribute({ value: ethers.parseEther("1") });
        expect(await Campaign.approversCount()).to.be.equal(2);
    });
    it("allow users to contribute and save as approvers", async function () {
        await Campaign.connect(accounts[0]).contribute({ value: ethers.parseEther("1") });
        const isApprover = await Campaign.approvers(accounts[0]);
        expect(isApprover).to.be.true;
    });

    it("doesn't allow users to contribute with less than the minimum contribution", async function () {
        try {
            await Campaign.connect(accounts[0]).contribute({ value: 88 })
            expect(false).to.be.true;
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
        }
    });
    it("allow manager to create a request", async function () {
        // Manager creates a request
        await Campaign.createRequest("Test Request", 100, accounts[1]);

        const request = await Campaign.requests(0);

        expect(request.description).to.equal("Test Request");
        expect(request.value).to.equal(100);
        expect(request.recipient).to.equal(accounts[1]);
        expect(request.completed).to.equal(false);
        expect(request.votersCount).to.equal(0);

    });

    it("allow approvers to approve a request", async function () {
        await Campaign.connect(accounts[0]).contribute({ value: 200 });
        await Campaign.createRequest("Test Request", 100, accounts[1]);
        await Campaign.connect(accounts[0]).approveRequest(0);
        const request = await Campaign.requests(0);
        expect(request.votersCount).to.equal(1);
        expect(await Campaign.voters(0, accounts[0])).to.be.true;
    });

    it("allow manager to finalize a request", async function () {
        await Campaign.connect(accounts[0]).contribute({ value: 200 });
        await Campaign.createRequest("Test Request", 100, accounts[1]);
        await Campaign.connect(accounts[0]).approveRequest(0);
        await Campaign.connect(Manager).finalizeRequest(0);
        const request = await Campaign.requests(0);
        expect(request.completed).to.equal(true);
    });

    it('process end to end test for creating a request and approving it', async function () {
        await Campaign.connect(accounts[0]).contribute({ value: ethers.parseEther("1") });

        await Campaign.createRequest("Test Request", ethers.parseEther("1"), accounts[1]);

        await Campaign.connect(accounts[0]).approveRequest(0);

        const recipientInitialBalance = await ethers.provider.getBalance(accounts[1]);

        await Campaign.connect(Manager).finalizeRequest(0);
        const request = await Campaign.requests(0);
        expect(request.completed).to.equal(true);



        const recipientFinalBalance = await ethers.provider.getBalance(accounts[1]);

        expect(
            recipientFinalBalance - recipientInitialBalance
        ).to.be.closeTo(ethers.parseEther("1"), ethers.parseEther("0.001"));

    });


});
