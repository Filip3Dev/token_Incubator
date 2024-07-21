// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PresaleToken.sol";

contract TokenFactory is Ownable {
    uint256 public creationFee = 0.3 ether;

    struct Project {
        address owner;
        address tokenAddress;
    }

    mapping(address => Project) public projects;
    mapping(address => address[]) public ownerProjects;

    event TokenCreated(address indexed owner, address indexed tokenAddress);
    event FeeUpdated(uint256 newFee);

    constructor() Ownable(msg.sender) {}

    function createToken(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply,
        uint256 _hardCap
    ) public payable {
        require(msg.value == creationFee, "Insufficient fee");

        // Transfer the fee to the owner as an internal transaction
        payable(owner()).transfer(creationFee);

        PresaleToken newToken = new PresaleToken(
            _name,
            _symbol,
            _totalSupply,
            _hardCap,
            _decimals,
            msg.sender
        );

        projects[address(newToken)] = Project(msg.sender, address(newToken));
        ownerProjects[msg.sender].push(address(newToken));

        emit TokenCreated(msg.sender, address(newToken));
    }

    function withdrawFees() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    function buyTokens(address _projectId) public payable {
        Project memory project = projects[_projectId];
        require(project.tokenAddress != address(0), "Invalid project ID");

        PresaleToken token = PresaleToken(project.tokenAddress);

        token.buyTokens{value: msg.value}(msg.sender);
    }

    function getTokenPrice(address _tokenAddress) public view returns (uint256) {
        PresaleToken token = PresaleToken(_tokenAddress);
        return token.tokenPrice();
    }

    function updateFee(uint256 _newFee) public onlyOwner {
        creationFee = _newFee;
        emit FeeUpdated(_newFee);
    }
}
