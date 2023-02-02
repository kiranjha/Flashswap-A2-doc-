// //SPDX-License-Identifier: UNLICENSED
// pragma solidity >=0.5.0 <=0.6.12;

// // import './interfaces/IUniswapV2Router.sol';
// // import './interfaces/IUniswapV2Router02.sol';
// // import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
// // import './interfaces/IUniswapV2Pair.sol';
// // import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol';
// // import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
// import './interfaces/IERC20.sol';
// import './interfaces/Uniswap.sol';
// import "hardhat/console.sol";

// // @author Daniel Espendiller - https://github.com/Haehnchen/uniswap-arbitrage-flash-swap - espend.de
// //
// // e00: out of block
// // e01: no profit
// // e10: Requested pair is not available
// // e11: token0 / token1 does not exist
// // e12: src/target router empty
// // e13: pancakeCall not enough tokens for buyback
// // e14: pancakeCall msg.sender transfer failed
// // e15: pancakeCall owner transfer failed
// // e16

// interface IUniswapV2Callee {
//     function uniswapV2Call(
//         address sender,
//         uint256 amount0,
//         uint256 amount1,
//         bytes calldata data
//     ) external; 
// }
// contract FlashswapPool is IUniswapV2Callee {
//     // address private TokenA;
//     // address private ROUTER;
//     address private UniswapV2Router;
//     address private UniswapV2Factory;
//     address tokenA;
//     address tokenB;
//     address tokenC;
//     constructor (address _factory, address _router, address _tokenA, address _tokenB, address _tokenC) public {
//         // TokenA = _token;
//         UniswapV2Router = _router;
//         UniswapV2Factory = _factory;
//         tokenA = _tokenA;
//         tokenB = _tokenB;
//         tokenC = _tokenC;
//     }

//     //addLiquidity for TokenA and TokenB
//     function addLiquidity(address _token0, address _token1, uint256 _amount0, uint256 _amount1) external {
//         console.log("AddLiq1");
//         IERC20(_token0).transferFrom(msg.sender, address(this), _amount0);
//         IERC20(_token1).transferFrom(msg.sender, address(this), _amount1);
//         console.log("AddLiq2");
//         IERC20(_token0).approve(UniswapV2Router, _amount0);
//         IERC20(_token1).approve(UniswapV2Router, _amount1);

//         console.log("AddLiq3");
//         (uint256 amount0, uint256 amount1, uint256 liquiditySum) = IUniswapV2Router(UniswapV2Router).addLiquidity(_token0,_token1,_amount0,_amount1,0,0,address(this),1699248402);
//         console.log("AddLiq4");
//     }
//     // we'll call this function to call to call FLASHLOAN on uniswap
//     function testFlashSwap(address _tokenBorrow, uint256 _amount) external {
//         // check the pair contract for token borrow and TokenA exists
//         address pair = IUniswapV2Factory(UniswapV2Factory).getPair(
//             _tokenBorrow,
//             tokenB
//         );
//         require(pair != address(0), "!pair");

//         // right now we dont know tokenborrow belongs to which token
//         address token0 = IUniswapV2Pair(pair).token0();
//         address token1 = IUniswapV2Pair(pair).token1();

//         // as a result, either amount0out will be equal to 0 or amount1out will be
//         uint256 amount0Out = _tokenBorrow == token0 ? _amount : 0;
//         uint256 amount1Out = _tokenBorrow == token1 ? _amount : 0;

//         // need to pass some data to trigger uniswapv2call
//         bytes memory data = abi.encode(_tokenBorrow, _amount);
//         // last parameter tells whether its a normal swap or a flash swap
//         IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
//         // adding data triggers a flashloan
//     }

//     // in return of flashloan call, uniswap will return with this function
//     // providing us the token borrow and the amount
//     // we also have to repay the borrowed amt plus some fees
//     function uniswapV2Call(
//         address _sender,
//         uint256 _amount0,
//         uint256 _amount1,
//         bytes calldata _data
//     ) external override {
//         // check msg.sender is the pair contract
//         // take address of token0 n token1
//         address token0 = IUniswapV2Pair(msg.sender).token0();
//         address token1 = IUniswapV2Pair(msg.sender).token1();
//         // call uniswapv2factory to getpair 
//         address pair = IUniswapV2Factory(UniswapV2Factory).getPair(token0, token1);
//         require(msg.sender == pair, "Not Pair");
//         // check sender holds the address who initiated the flash loans
//         require(_sender == address(this), "Not Sender");

//         (address tokenBorrow, uint amount) = abi.decode(_data, (address, uint));
//         // console.log("Flashswap Balance from contract ",IERC20(tokenBorrow).balanceOf(address(this)));
//         // about 0.3% fees, +1 to round up
//         uint fee = ((amount * 3) / 997) + 1;
//         uint amountToRepay = amount + fee;
//         console.log("Token receive after flashswap :- ",IERC20(tokenBorrow).balanceOf(address(this)));

//         address[] memory path;
//         path = new address[](2);
//         path[0] = tokenA;
//         path[1] = tokenB;
//         uint256[] memory amountOutMin = IUniswapV2Router(UniswapV2Router).swapExactTokensForTokens(amount, amount*2, path, address(this), 1699248402);
//         IERC20(tokenBorrow).transfer(pair, amountToRepay);
//     }
// }
