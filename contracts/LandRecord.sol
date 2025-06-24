// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRecord {
    struct Record {
        string titleDeedNumber;
        string owner;
        bool verified;
    }
    
    mapping(string => Record) public records;
    address public admin;

    event RecordVerified(string titleDeedNumber);

    constructor() {
        admin = msg.sender;
    }

    function verifyRecord(string memory _titleDeedNumber) public {
        require(msg.sender == admin, "Only admin");
        records[_titleDeedNumber].verified = true;
        emit RecordVerified(_titleDeedNumber);
    }
}