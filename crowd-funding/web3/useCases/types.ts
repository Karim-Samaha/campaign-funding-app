import { Contract, Signer, Provider } from 'ethers';

export interface ContractConfig {
  signerOrProvider: Signer | Provider;
}

export interface FactoryContractInstance extends Contract {
  createCampaign: (name: string, description: string, minimum: number) => Promise<any>;
  getDeployedCampaigns: () => Promise<string[]>;
}

export interface CampaignContractInstance extends Contract {
  approveRequest: (index: bigint) => Promise<any>;
  contribute: (options?: { value: bigint }) => Promise<any>;
  createRequest: (description: string, value: bigint, recipient: string) => Promise<any>;
  finalizeRequest: (index: bigint) => Promise<any>;
  getCampaignSummary: () => Promise<[bigint, bigint, bigint, bigint, string]>;
  getRequestsCount: () => Promise<bigint>;
  approvers: (address: string) => Promise<boolean>;
  approversCount: () => Promise<bigint>;
  manger: () => Promise<string>;
  minumumContribution: () => Promise<bigint>;
  requests: (index: bigint) => Promise<[string, bigint, string, boolean, bigint]>;
  voters: (requestIndex: bigint, address: string) => Promise<boolean>;
}

export interface CampaignSummary {
  minimumContribution: bigint;
  balance: bigint;
  requestsCount: bigint;
  approversCount: bigint;
  manager: string;
}

export interface Request {
  description: string;
  value: bigint;
  recipient: string;
  completed: boolean;
  votersCount: bigint;
}

