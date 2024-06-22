import Web3 from "web3";
import CrowdFunding from '../contracts/client/artifacts/contracts/Crowdfunding.sol/Crowdfunding.json'
import {
    crowdFundingContractLoaded,
    projectContractsLoaded,
    projectsLoaded,
    walletAddressLoaded,
    web3Loaded
} from "@/redux/actions";
import Project from '../contracts/client/artifacts/contracts/Project.sol/Project.json'
import {projectDataFormatter} from "@/utils/common";
import {crowdFundingContractAddress, getCrowdFundingContract} from "@/utils/requestHandlers";
import web3Singleton from "@/utils/web3Singleton";
// import { groupContributionByProject, groupContributors, projectDataFormatter, withdrawRequestDataFormatter} from "../helper/helper";

//Load web3
export const loadWeb3 = async () => {
    return web3Singleton.initialize(Web3.givenProvider)
};

// Load connected wallet
export const loadAccount = async (web3: any) => {
    const account = await web3.eth.getAccounts();
    const network = await web3.eth.net.getId();

//   if (network !== Number(process.env.REACT_APP_NETWORK_ID)) {
//     alert("Contract not deployed in this network !");
//   }
    // dispatch(walletAddressLoaded(account[0]));
    // localStorage.setItem("user",account[0])
    return account;
};

//Connect with crowd funding contract
export const loadCrowdFundingContract = async (web3: any) => {
    const crowdFunding = new web3.eth.Contract(CrowdFunding.abi, crowdFundingContractAddress);
    return crowdFunding;
}
//
// // Start fund raising project
// export const startFundRaising = async(web3,CrowdFundingContract,data,onSuccess,onError,dispatch) =>{
//     const {minimumContribution,deadline,targetContribution,projectTitle,projectDesc,account} = data;
//
//     await CrowdFundingContract.methods.createProject(minimumContribution,deadline,targetContribution,projectTitle,projectDesc).send({from:account})
//         .on('receipt', function(receipt){
//
//             const projectsReceipt = receipt.events.ProjectStarted.returnValues;
//             const contractAddress = projectsReceipt.projectContractAddress;
//
//             const formattedProjectData = projectDataFormatter(projectsReceipt,contractAddress)
//             var projectConnector = new web3.eth.Contract(Project.abi,contractAddress);
//
//             dispatch(actions.newProjectContractsLoaded(projectConnector));
//             dispatch(actions.newProjectsLoaded(formattedProjectData));
//
//             onSuccess()
//         })
//         .on('error', function(error){
//             onError(error.message)
//         })
// }
//
// // 1 - Get all funding project address
// // 2 - Connect with funding project contract
// // 3 - Get project details
export const getAllFunding = async (CrowdFundingContract: any, web3: any) => {
    console.log('--')
    const fundingProjectList = await CrowdFundingContract.methods.returnAllProjects().call()
    console.log('sss')
    //@ts-ignore
    const projectContracts = [];
    //@ts-ignore
    const projects = [];

    await Promise.all(fundingProjectList.map(async (data: any) => {
        var projectConnector = new web3.eth.Contract(Project.abi, data);
        const details = await projectConnector.methods.getProjectDetails().call()
        projectContracts.push(projectConnector);
        const formattedProjectData = projectDataFormatter(details, data)
        projects.push(formattedProjectData)
    }))
}
//
// // Contribute in fund raising project
// export const contribute = async(crowdFundingContract,data,dispatch,onSuccess,onError) =>{
//     const {contractAddress,amount,account} = data;
//     await crowdFundingContract.methods.contribute(contractAddress).send({from:account,value:amount})
//         .on('receipt', function(receipt){
//             dispatch(actions.amountContributor({projectId:contractAddress,amount:amount}))
//             onSuccess()
//         })
//         .on('error', function(error){
//             onError(error.message)
//         })
// }
//
// // Get all contributors by contract address
// export const getContributors = async (web3,contractAddress,onSuccess,onError) =>{
//     try {
//         var projectConnector = new web3.eth.Contract(Project.abi,contractAddress);
//         const getContributions = await projectConnector.getPastEvents("FundingReceived",{
//             fromBlock: 0,
//             toBlock: 'latest'
//         })
//         onSuccess(groupContributors(getContributions))
//     } catch (error) {
//         onError(error)
//     }
// }
//
// // Request for withdraw amount
// export const createWithdrawRequest = async (web3,contractAddress,data,onSuccess,onError) =>{
//     const {description,amount,recipient,account} = data;
//     var projectConnector = new web3.eth.Contract(Project.abi,contractAddress);
//     await projectConnector.methods.createWithdrawRequest(description,amount,recipient).send({from:account})
//         .on('receipt', function(receipt){
//             const withdrawReqReceipt = receipt.events.WithdrawRequestCreated.returnValues;
//             const formattedReqData = withdrawRequestDataFormatter(withdrawReqReceipt,withdrawReqReceipt.requestId)
//             onSuccess(formattedReqData)
//         })
//         .on('error', function(error){
//             onError(error.message)
//         })
// }
//
// // Get all withdraw request
// export const getAllWithdrawRequest = async (web3,contractAddress,onLoadRequest) =>{
//     var projectConnector = new web3.eth.Contract(Project.abi,contractAddress);
//     var withdrawRequestCount = await projectConnector.methods.numOfWithdrawRequests().call();
//     var withdrawRequests = [];
//
//     if(withdrawRequestCount <= 0){
//         onLoadRequest(withdrawRequests)
//         return
//     }
//
//     for(var i=1;i<=withdrawRequestCount;i++){
//         const req = await projectConnector.methods.withdrawRequests(i-1).call();
//         withdrawRequests.push(withdrawRequestDataFormatter({...req,requestId:i-1}));
//     }
//     onLoadRequest(withdrawRequests)
// }
//
// // Vote for withdraw request
// export const voteWithdrawRequest = async (web3,data,onSuccess,onError) =>{
//     const {contractAddress,reqId,account} = data;
//     var projectConnector = new web3.eth.Contract(Project.abi,contractAddress);
//     await projectConnector.methods.voteWithdrawRequest(reqId).send({from:account})
//         .on('receipt', function(receipt){
//             console.log(receipt)
//             onSuccess()
//         })
//         .on('error', function(error){
//             onError(error.message)
//         })
//
// }
//
// // Withdraw requested amount
// export const withdrawAmount = async (web3,dispatch,data,onSuccess,onError) =>{
//     const {contractAddress,reqId,account,amount} = data;
//     var projectConnector = new web3.eth.Contract(Project.abi,contractAddress);
//     await projectConnector.methods.withdrawRequestedAmount(reqId).send({from:account})
//         .on('receipt', function(receipt){
//             console.log(receipt)
//             dispatch(actions.withdrawContractBalance({
//                 contractAddress:contractAddress,
//                 withdrawAmount:amount
//             }))
//             onSuccess()
//         })
//         .on('error', function(error){
//             onError(error.message)
//         })
// }
//
// //Get my contributions
// export const getMyContributionList = async(crowdFundingContract,account) =>{
//     const getContributions = await crowdFundingContract.getPastEvents("ContributionReceived",{
//         filter: { contributor: account },
//         fromBlock: 0,
//         toBlock: 'latest'
//     })
//     return groupContributionByProject(getContributions);
// }

export const loadBlockchain = async () => {
    console.log('load block chanin')
    const web3Instance  = await loadWeb3()
    const account = await loadAccount(web3Instance)
    const crowdFundingContract = await loadCrowdFundingContract(web3Instance)
    console.log('crowdFundingContract', crowdFundingContract)
    await getAllFunding(crowdFundingContract, web3Instance)
}

export const getMyProject = async (myAccount: any) => {
    const crowdFundingContract = await getCrowdFundingContract()
    const fundingProjectList = await crowdFundingContract.methods.returnAllProjects().call()
    //@ts-ignore
    const projectContracts = [];
    //@ts-ignore
    const projects = [];

    await Promise.all(fundingProjectList.map(async (data: any) => {
        var projectConnector = new (await loadWeb3()).eth.Contract(Project.abi, data);
        const details = await projectConnector.methods.getProjectDetails().call()
        projectContracts.push(projectConnector);
        const formattedProjectData = projectDataFormatter(details, data)
        projects.push(formattedProjectData)
    }))

    //@ts-ignore
    return _.filter(projects, p=>p.creator.toLowerCase() === myAccount)
}