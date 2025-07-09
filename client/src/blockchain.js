import Web3 from 'web3';
import LandRecordContract from '@truffle/contract';
import landRecordArtifact from './contracts/LandRecord.json';

export const loadBlockchainData = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  const web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: 'eth_requestAccounts' }); // Ensure connection
  const accounts = await web3.eth.getAccounts();

  const landRecord = LandRecordContract(landRecordArtifact);
  landRecord.setProvider(web3.currentProvider);

  const deployedContract = await landRecord.deployed();

  return { web3, accounts, contract: deployedContract };
};