//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <=0.6.12;

// // import './interfaces/IUniswapV2Router.sol';
// // import './interfaces/IUniswapV2Router02.sol';
// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
// // import '@uniswap/v2-core/contracts/UniswapV2Pair.sol';
// // import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol';
// // import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import './interfaces/IERC20.sol';
import './interfaces/Uniswap.sol';
import "hardhat/console.sol";

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
// contract Flashswap is IUniswapV2Callee {
//     address private TokenA;
//     address private UniswapV2Factory;
//     constructor (address _token, address _factory) public {
//         TokenA = _token;
//         UniswapV2Factory = _factory;
//     }

//     // we'll call this function to call to call FLASHLOAN on uniswap
//     function testFlashSwap(address _tokenBorrow, uint256 _amount) external {
//         // check the pair contract for token borrow and TokenA exists
//         address pair = IUniswapV2Factory(UniswapV2Factory).getPair(
//             _tokenBorrow,
//             TokenA
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

//         IERC20(tokenBorrow).transfer(pair, amountToRepay);
//     }
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol';
// import './interfaces/IERC20.sol';
// import './interfaces/Uniswap.sol';
// import "hardhat/console.sol";
// contract Flashswap {
//     address public factoryV2;
//     uint256 public flashLoanAmount = 100;  //100 tokenA in wei
//     uint256 public amountReceived;
    
//     constructor (address _factory) public {
//         factoryV2 = _factory;
//     }
//     // we'll call this function to call to call FLASHLOAN on uniswap
//     function performFlashSwap(address _tokenA, address _tokenB, address _pool1) public {
//         console.log("F1");
//         IUniswapV2Callee callee = IUniswapV2Callee(address(this));
//         console.log("F2");
//         address pair = IUniswapV2Factory(factoryV2).getPair(_tokenA, _tokenB);
//         console.log("F3");
//         bytes memory data = abi.encode(_pool1, flashLoanAmount);
//         console.log("F4");

//         // address token0 = IUniswapV2Pair(pair).token0();
//         // address token1 = IUniswapV2Pair(pair).token1();

//         // uint256 amount0Out = pair == token0 ? _flashLoanAmount : 0;
//         // uint256 amount1Out = pair == token1 ? _flashLoanAmount : 0;
//         IUniswapV2Pair(pair).swap(flashLoanAmount, 0, address(this), data);
//         console.log("F5");
//     }

//     function uniswapV2Call(address _sender, uint256 _amount0, uint256 _amount1, bytes calldata _data) public {
//         console.log("F6");
//         address token0 = IUniswapV2Pair(msg.sender).token0();
//         console.log("F7");
//         address token1 = IUniswapV2Pair(msg.sender).token1();
//         console.log("F8");
//         address pair = IUniswapV2Factory(factoryV2).getPair(token0, token1);
//         require(msg.sender == pair, "Not Pair");
//         // check sender holds the address who initiated the flash loans
//         require(_sender == address(this), "Not Sender");

//         // assert(_sender == IUniswapV2Factory(factoryV2).getPair(token0, token1));
//         console.log("F9");
//         //transfer received tokens to the contract owner
//         // address contractOwner = msg.sender;
//         console.log("F10");
//         amountReceived = _amount0 + _amount1;
//         console.log("F11");
//         IERC20(token0).transfer(address(this),amountReceived);
//         console.log("F12");
//         console.log("Token receive after flashswap :- ",amountReceived);
//         console.log("F13");
//     }

//     function repayAmountReceived(address tokenA, address tokenB) public {
//         address pair = IUniswapV2Factory(factoryV2).getPair(tokenA, tokenB);
//         address contractOwner = msg.sender;
//         bytes memory data = abi.encode(contractOwner, flashLoanAmount);
//         IUniswapV2Pair(pair).swap(amountReceived, 0, contractOwner, data);
//     }
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// interface IUniswapV2Callee {
//     function uniswapV2Call(
//         address sender,
//         uint amount0,
//         uint amount1,
//         bytes calldata data
//     ) external;
// }

// contract Flashswap is IUniswapV2Callee {
//     address private UNISWAP_V2_FACTORY;
//     address private DAI;
//     address private WETH;

//     IUniswapV2Factory private factory;

//     IERC20 private weth = IERC20(WETH);

//     address private pair;

//     // For this example, store the amount to repay
//     uint public amountToRepay;

//     constructor(address uniswapV2Factory, address dai, address weth) public {
//         UNISWAP_V2_FACTORY = uniswapV2Factory;
//         DAI = dai;
//         WETH = weth;

//         factory = IUniswapV2Factory(UNISWAP_V2_FACTORY);
//         // weth = IERC20(WETH);
        
//     }

//     // function callPair() external returns (address) {
//     //     // console.log("*******************************PAir",pair);
//     //     return address(pair);
//     // }

//     function flashSwap(uint wethAmount) external {
//         // Need to pass some data to trigger uniswapV2Call
//         pair = factory.getPair(DAI, WETH);
//         bytes memory data = abi.encode(WETH, msg.sender);

//         // amount0Out is DAI, amount1Out is WETH
//         IUniswapV2Pair(pair).swap(0, wethAmount, address(this), data);
//     }

//     // This function is called by the DAI/WETH pair contract
//     function uniswapV2Call(
//         address sender,
//         uint amount0,
//         uint amount1,
//         bytes calldata data
//     ) external override {
//         require(msg.sender == address(pair), "not pair");
//         require(sender == address(this), "not sender");

//         (address tokenBorrow, address caller) = abi.decode(data, (address, address));

//         // Your custom code would go here. For example, code to arbitrage.
//         require(tokenBorrow == WETH, "token borrow != WETH");

//         // about 0.3% fee, +1 to round up
//         uint fee = (amount1 * 3) / 997 + 1;
//         amountToRepay = amount1 + fee;

//         // Transfer flash swap fee from caller
//         weth.transferFrom(caller, address(this), fee);

//         // Repay
//         weth.transfer(address(pair), amountToRepay);
//     }
// }

// interface IUniswapV2Pair {
//     function swap(
//         uint amount0Out,
//         uint amount1Out,
//         address to,
//         bytes calldata data
//     ) external;
// }
// interface IUniswapV2Factory {
//     function getPair(
//         address tokenA,
//         address tokenB
//     ) external view returns (address pair);
// }
// interface IERC20 {
//     function totalSupply() external view returns (uint);

//     function balanceOf(address account) external view returns (uint);

//     function transfer(address recipient, uint amount) external returns (bool);

//     function allowance(address owner, address spender) external view returns (uint);

//     function approve(address spender, uint amount) external returns (bool);

//     function transferFrom(
//         address sender,
//         address recipient,
//         uint amount
//     ) external returns (bool);

//     event Transfer(address indexed from, address indexed to, uint value);
//     event Approval(address indexed owner, address indexed spender, uint value);
// }

/////////////////////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
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
    address private TokenB;
    address private TokenC;
    address private UniswapV2Factory;
    address private UniswapV2Router;
    uint256 private beforeFlashBalA;
    uint256 private beforeFlashBalB;
    uint256 private beforeFlashBalC;
    // uint256 private afterFlashBal;

    constructor (address _factory, address _router, address _tokenA, address _tokenB, address _tokenC) public {
        UniswapV2Factory = _factory;
        UniswapV2Router = _router;
        TokenA = _tokenA;
        TokenB = _tokenB;
        TokenC = _tokenC;
    }

    // we'll call this function to call to call FLASHLOAN on uniswap
    function testFlashSwap(address _tokenBorrow, uint256 _amount) external {
        console.log("1.1");
        IERC20(TokenA).transferFrom(msg.sender, address(this), 1000000);
        IERC20(TokenB).transferFrom(msg.sender, address(this), 1000000);
        IERC20(TokenC).transferFrom(msg.sender, address(this), 1000000);

        console.log("1.2");
        IERC20(TokenA).approve(UniswapV2Router, 1000000);
        IERC20(TokenB).approve(UniswapV2Router, 1000000);
        IERC20(TokenC).approve(UniswapV2Router, 1000000);
        

        IUniswapV2Router(UniswapV2Router)
            .addLiquidity(
                TokenA,
                TokenB,
                100000,
                100000,
                1,
                1,
                address(this),
                1692742340
            );
            console.log("1.3");
        IUniswapV2Router(UniswapV2Router)
            .addLiquidity(
                TokenA,
                TokenC,
                100000,
                200000,
                1,
                1,
                address(this),
                1692742340
            );
            console.log("1.4");
        IUniswapV2Router(UniswapV2Router)
            .addLiquidity(
                TokenB,
                TokenC,
                200000,
                100000,
                1,
                1,
                address(this),
                1692742340
            );
            console.log("1.5");
        // check the pair contract for token borrow and TokenA exists
        address pair = IUniswapV2Factory(UniswapV2Factory).getPair(
            _tokenBorrow,
            TokenB
        );
        console.log("Pool A/B Pair address :- ",pair);
        {
        require(pair != address(0), "!pair");
        // right now we dont know tokenborrow belongs to which token
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        console.log("token0 :- ",token0);
        console.log("token1 :- ",token1);
        console.log("1.6");
        // as a result, either amount0out will be equal to 0 or amount1out will be
        uint256 amount0Out = _tokenBorrow == token0 ? _amount : 0;
        uint256 amount1Out = _tokenBorrow == token1 ? _amount : 0;
        console.log("1.7");
        console.log("amount0Out :- ",amount0Out);
        console.log("amount1Out :- ",amount1Out);

        // need to pass some data to trigger uniswapv2call
        bytes memory data = abi.encode(_tokenBorrow, _amount, msg.sender);
        console.log("1.8");
        console.log("TokenA before flashswap :- ",IERC20(_tokenBorrow).balanceOf(address(this)));
        console.log("TokenB before Swapping :- ",IERC20(TokenB).balanceOf(address(this)));
        console.log("TokenC before flashswap :- ",IERC20(TokenC).balanceOf(address(this)));
        beforeFlashBalA = IERC20(_tokenBorrow).balanceOf(address(this));
        beforeFlashBalB = IERC20(TokenB).balanceOf(address(this));
        beforeFlashBalC = IERC20(TokenC).balanceOf(address(this));
        // last parameter tells whether its a normal swap or a flash swap
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
        console.log("1.9");

        
        // adding data triggers a flashloan
        }
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
        console.log("Pool A/B Pair address :- ",pair);
        require(msg.sender == pair, "Not Pair");
        // check sender holds the address who initiated the flash loans
        require(_sender == address(this), "Not Sender");

        (address tokenBorrow, uint amount, address caller) = abi.decode(_data, (address, uint, address));
        uint amountReceived = (IERC20(tokenBorrow).balanceOf(address(this))) - beforeFlashBalA;
        console.log("TokenA receive after flashswap :- ",amountReceived);

        //swap borrowedamount A for tokenC from A/C
        address[] memory path;
        path = new address[](2);
        path[0] = TokenA;
        path[1] = TokenC;
        uint[] memory amountsC = IUniswapV2Router(UniswapV2Router).swapExactTokensForTokens(amountReceived, amountReceived, path, address(this), 1692742340);
        uint amountC = amountsC[1];
        console.log("amountsC[0][1] after exchange",amountsC[0],amountC);
        console.log("Token C receive after swapping :- ",(IERC20(TokenC).balanceOf(address(this)))-beforeFlashBalC);

        //swap tokenC for tokenB from B/C
        path[0] = TokenC;
        path[1] = TokenB;
        uint[] memory amountsB = IUniswapV2Router(UniswapV2Router).swapExactTokensForTokens(amountC, amountC, path, address(this), 1692742340); 
        uint amountB = amountsB[1];
        console.log("amountsB[0][1] after exchange",amountsB[0],amountB);
        // console.log("Token B receive after swapping :- ",IERC20(TokenB).balanceOf(address(this)));
////the commented block below tries to reentrancy 
// {
//         //swap tokenB for tokenA from B/A
//         path[0] = TokenB;
//         path[1] = TokenA;
//         uint[] memory A = IUniswapV2Router(UniswapV2Router).getAmountsOut(amountB, path);
//         console.log("Max of out TokenA :- ", A[0]);
//         console.log("Min of out TokenA :- ", A[1]);
//         uint[] memory amountsA = IUniswapV2Router(UniswapV2Router).swapExactTokensForTokens(amountB, A[1], path, address(this), 1692742340); 
//         uint amountA = amountsA[1];
//         console.log("amountsA[0][1] after exchange",amountsA[0],amountA);
//         console.log("Token A receive after swapping :- ",IERC20(TokenA).balanceOf(address(this)));
// }

        // about 0.3% fees, +1 to round up
        uint fee = ((amount * 3) / 997) + 1;
        uint amountToRepay = amount + fee;
        require(tokenBorrow == TokenA, "token borrow not equal to TokenA");
        // IERC20(TokenB).transferFrom(caller, address(this), fee);
        // IERC20(TokenB).transfer(pair, amountToRepay);
        IERC20(TokenB).transfer(pair, amountToRepay);
    }
}