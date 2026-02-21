// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;


contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool completed;
        uint votersCount;
    }
    address public manger;
    uint public minumumContribution;
    mapping (address => bool) public approvers;
    uint public  approversCount;
    Request[] public requests;
    mapping(uint256 => mapping(address => bool)) public voters;



    constructor(address sender, uint minimum)  {
        manger = sender;
        minumumContribution = minimum;
    }

    modifier onlyManger {
        require(msg.sender == manger, "Only Manger can do that");
        _;
    }
    // create modifer for onlyApprovers
         modifier onlyApprover {
        require(approvers[msg.sender], "Only Approvers");
        _;
    }

    // create modifter for votersApproved
 

    function contribute() public  payable  {
        require(msg.value > minumumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest (string memory description, uint value, address recipient) public onlyManger {
       requests.push(Request({
        description: description,
        value: value,
        recipient: recipient,
        completed: false,
        votersCount: 0
       }));
    }

    // function to approve a request onlyApprovers
     function approveRequest(uint256 index) public onlyApprover {
        Request storage request = requests[index];

        require(!request.completed, "Request completed");
        require(!voters[index][msg.sender], "Already approved");

        voters[index][msg.sender] = true;
        request.votersCount++;
    }

    // function to finlaize request votersApproved
    function finalizeRequest(uint256 index) public onlyManger {
        Request storage request = requests[index];
        
        require(!request.completed, "Already Finalized");

        require(request.votersCount >= (approversCount / 2), "Not enugh voters");
        
        (bool sent, ) = payable(request.recipient).call{value: request.value}("");
        require(sent, "Failed to send Ether");

        request.completed = true;
    }

    function getCampaignSummary() public view  returns (uint256,uint256,uint256,uint256,address) {
        return (minumumContribution, address(this).balance, requests.length, approversCount, manger);
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
  
}