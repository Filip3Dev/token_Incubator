// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

contract PresaleToken is ERC20, ERC4626, Ownable, ReentrancyGuard, Pausable {
    uint256 public hardCap;
    uint256 public totalRaised;
    uint256 public tokenPrice;
    bool public presaleEnded;
    uint8 private _tokenDecimals;

    mapping(address => uint256) public contributions;

    event TokensPurchased(address indexed buyer, uint256 amount);
    event PresaleEnded(bool success);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event Refunded(address indexed contributor, uint256 amount);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        uint256 _hardCap,
        uint8 _decimals,
        address _creator
    ) ERC20(_name, _symbol) ERC4626(ERC20(address(this))) Ownable(_creator) {
        require(_totalSupply > 0, "Total supply must be greater than zero");
        require(_hardCap > 0, "Hard cap must be greater than zero");

        _mint(_creator, _totalSupply);
        _tokenDecimals = _decimals;
        hardCap = _hardCap;
        tokenPrice = _hardCap / (_totalSupply); // Calculando o preço do token dinamicamente
    }

    function decimals() public view virtual override(ERC20, ERC4626) returns (uint8) {
        return _tokenDecimals;
    }

    modifier onlyWhileOpen {
        require(!presaleEnded, "Presale has ended");
        require(totalRaised < hardCap, "Hard cap reached");
        _;
    }

    function buyTokens(address buyer) public payable onlyWhileOpen nonReentrant whenNotPaused {
        uint256 totalCost = msg.value;
        uint256 amountWithDecimals = (totalCost * (10 ** _tokenDecimals)) / tokenPrice;
        require(amountWithDecimals >= 1 * (10 ** _tokenDecimals), "Amount is below minimum tokens per purchase");

        require(totalRaised + totalCost <= hardCap, "Purchase exceeds hard cap");
        require(balanceOf(owner()) >= amountWithDecimals, "Not enough tokens left for sale");

        totalRaised += totalCost;
        contributions[buyer] += totalCost;

        _transfer(owner(), buyer, amountWithDecimals);
        emit TokensPurchased(buyer, amountWithDecimals / (10 ** _tokenDecimals));

        if (totalRaised >= hardCap || balanceOf(owner()) == 0) {
            presaleEnded = true;
            emit PresaleEnded(true);
        }

        // Refund excess ETH sent
        if (msg.value > totalCost) {
            (bool success, ) = buyer.call{value: msg.value - totalCost}("");
            require(success, "Refund failed");
        }
    }

    function endPresale() public onlyOwner {
        presaleEnded = true;
        emit PresaleEnded(true);
    }

    function withdrawFunds() public onlyOwner nonReentrant {
        require(presaleEnded, "Presale not ended");
        uint256 balance = address(this).balance;
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
        emit FundsWithdrawn(owner(), balance);
    }

    function refund() public nonReentrant {
        require(presaleEnded && totalRaised < hardCap, "Presale not failed");
        uint256 amount = contributions[msg.sender];
        require(amount > 0, "No contributions found");

        contributions[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Refund failed");
        emit Refunded(msg.sender, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
