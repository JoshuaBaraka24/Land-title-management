import Web3 from 'web3';
import LandRecordContract from '@truffle/contract';
import landRecordArtifact from './contracts/LandRecord.json';

export const loadBlockchainData = async () => {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const accounts = await web3.eth.getAccounts();
  
  const landRecord = LandRecordContract(landRecordArtifact);
  landRecord.setProvider(web3.currentProvider);
  
  const deployedContract = await landRecord.deployed();
  
  return { web3, accounts, contract: deployedContract };
};