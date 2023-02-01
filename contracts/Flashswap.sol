//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <=0.6.12;

// import './interfaces/IUniswapV2Router.sol';
// import './interfaces/IUniswapV2Router02.sol';
// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
// import './interfaces/IUniswapV2Pair.sol';
// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol';
// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import './interfaces/IERC20.sol';
import './interfaces/Uniswap.sol';
import "hardhat/console.sol";

// @author Daniel Espendiller - https://github.com/Haehnchen/uniswap-arbitrage-flash-swap - espend.de
//
// e00: out of block
// e01: no profit
// e10: Requested pair is not available
// e11: token0 / token1 does not exist
// e12: src/target router empty
// e13: pancakeCall not enough tokens for buyback
// e14: pancakeCall msg.sender transfer failed
// e15: pancakeCall owner transfer failed
// e16

interface IUniswapV2Callee {
    function uniswapV2Call(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external; 
}
contract Flashswap is IUniswapV2Callee {
    address private TokenA;
    address private UniswapV2Factory;
    constructor (address _token, address _factory) public {
        TokenA = _token;
        UniswapV2Factory = _factory;
    }
    // we'll call this function to call to call FLASHLOAN on uniswap
    function testFlashSwap(address _tokenBorrow, uint256 _amount) external {
        // check the pair contract for token borrow and TokenA exists
        address pair = IUniswapV2Factory(UniswapV2Factory).getPair(
            _tokenBorrow,
            TokenA
        );
        require(pair != address(0), "!pair");

        // right now we dont know tokenborrow belongs to which token
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();

        // as a result, either amount0out will be equal to 0 or amount1out will be
        uint256 amount0Out = _tokenBorrow == token0 ? _amount : 0;
        uint256 amount1Out = _tokenBorrow == token1 ? _amount : 0;

        // need to pass some data to trigger uniswapv2call
        bytes memory data = abi.encode(_tokenBorrow, _amount);
        // last parameter tells whether its a normal swap or a flash swap
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
        // adding data triggers a flashloan
    }

    // in return of flashloan call, uniswap will return with this function
    // providing us the token borrow and the amount
    // we also have to repay the borrowed amt plus some fees
    function uniswapV2Call(
        address _sender,
        uint256 _amount0,
        uint256 _amount1,
        bytes calldata _data
    ) external override {
        // check msg.sender is the pair contract
        // take address of token0 n token1
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        // call uniswapv2factory to getpair 
        address pair = IUniswapV2Factory(UniswapV2Factory).getPair(token0, token1);
        require(msg.sender == pair, "Not Pair");
        // check sender holds the address who initiated the flash loans
        require(_sender == address(this), "Not Sender");

        (address tokenBorrow, uint amount) = abi.decode(_data, (address, uint));
        // console.log("Flashswap Balance from contract ",IERC20(tokenBorrow).balanceOf(address(this)));
        // about 0.3% fees, +1 to round up
        uint fee = ((amount * 3) / 997) + 1;
        uint amountToRepay = amount + fee;
        console.log("Token receive after flashswap :- ",IERC20(tokenBorrow).balanceOf(address(this)));
        IERC20(tokenBorrow).transfer(pair, amountToRepay);
    }
}

