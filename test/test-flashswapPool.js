// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { BigNumber } = require("@ethersproject/bignumber");


// describe("Create Pool and then Flashswap", async () => {
//     let owner, addr1, addr2;
//     let router, factory, weth, flashswap;
//     let tokenA, tokenB, tokenC;
//     let token1, token2, token3;

//     let borrowAmount = 1000; //1,00,000 - 1000
//     beforeEach(async () => {
//         [owner, addr1, addr2] = await ethers.getSigners();

//         let contract1 = await ethers.getContractFactory("UniswapV2Factory");
//         factory = await contract1.deploy(owner.address);
//         await factory.deployed();

//         let contract2 = await ethers.getContractFactory("WETH9");
//         weth = await contract2.deploy();
//         await weth.deployed();

//         let contract3 = await ethers.getContractFactory("UniswapV2Router02");
//         router = await contract3.deploy(factory.address, weth.address);
//         await router.deployed();

//         tokenA = await ethers.getContractFactory("MyToken1");
//         token1 = await tokenA.deploy();

//         tokenB = await ethers.getContractFactory("MyToken2");
//         token2 = await tokenB.deploy();

//         tokenC = await ethers.getContractFactory("MyToken3");
//         token3 = await tokenC.deploy();

//         let contract4 = await ethers.getContractFactory("FlashswapPool");
//         flashswap = await contract4.deploy(factory.address, router.address, token1.address, token2.address, token3.address);
//         await flashswap.deployed();

//         await token1.approve(flashswap.address, 100000);
//         await token2.approve(flashswap.address, 100000);
//         await token3.approve(flashswap.address, 100000);

//         console.log("Router Contract Address :- ", router.address);
//         console.log("TokenA Contract Address :- ", token1.address);
//         console.log("TokenB Contract Address :- ", token2.address);
//         console.log("TokenC Contract Address :- ", token3.address);
//         console.log("Flashswap Contract Address :- ", flashswap.address);

//         await token1.mint(100000);
//         await token2.mint(100000);
//         await token3.mint(100000);

//     });
//     // it("Liquidity Pool", async () => {
//     //     let ab = await flashswap.addLiquidity(token1.address, token2.address, 10000, 10000);
//     //     console.log(ab);

//     //     let ac = await flashswap.addLiquidity(token1.address, token3.address, 10000, 10000);
//     //     console.log(ac);
//     // });
//     it("Flash Swap", async () => {

//         //AddLiquidity for pair TokenA and TokenB
//         let ab = await flashswap.addLiquidity(token1.address, token2.address, 10000, 10000);
//         console.log(ab,"\n");

//         let ac = await flashswap.addLiquidity(token1.address, token3.address, 10000, 10000);
//         console.log(ac);


//         //AddLiquidity for pair TokenB and TokenC
//         // let bc = await router.addLiquidity(token2.address, token3.address, 20000, 10000, 0, 0, owner.address, 1692742340);
//         // console.log(bc, "\n");

//         //Perform flashswap for borrowedAmount 1000 of TokenA 
//         //flashwap contracts prints the TokenA amount received by flashswap contract 
//         const fee = Math.round(((borrowAmount * 3) / 997)) + 1;
//         await token1.transfer(flashswap.address, fee);
//         await flashswap.testFlashSwap(token1.address, borrowAmount);
//         const flashswapBalance = await token1.balanceOf(flashswap.address);
//         expect(flashswapBalance.eq(BigNumber.from("0"))).to.be.true;

//         // //calling getAmountsOut function to get the amountOutMin parameter for swapExactTokensForTokens
//         // let [minC, maxC] = await router.getAmountsOut(borrowAmount, [token1.address, token3.address]);
//         // console.log("Min of out TokenC :- ", minC);
//         // console.log("Max of out TokenC :- ", maxC);

//         // //Exchange that recieved TokenA for TokenC
//         // //Balance of TokenC at addr1 before swapping
//         // let tokenCBalance = await token3.balanceOf(addr1.address);
//         // console.log("\nAddr1 receives TokenC balance Before Swap: ", tokenCBalance.toString());

//         // //swapping would be done for TokenC
//         // let swapForC = await router.swapExactTokensForTokens(borrowAmount, minC, [token1.address, token3.address], addr1.address, 1692742340);
//         // console.log("After swapping TokenA for TokenC array of amounts :- \n", swapForC[0], "\n");

//         // //Prints the amount of TokenC received by addr1 after swapping
//         // tokenCBalance = await token3.balanceOf(addr1.address);
//         // console.log("\nAddr1 receives TokenC balance After Swap: ", tokenCBalance.toString());

//         // ////////////////////////////////Again swap that received TokenC for TokenB//////////////////////////////////
//         // //calling getAmountsOut function to get the amountOutMin parameter for swapExactTokensForTokens
//         // let [minB, maxB] = await router.getAmountsOut(tokenCBalance, [token3.address, token2.address]);
//         // console.log("Min of out TokenB :- ", minB);
//         // console.log("Max of out TokenB :- ", maxB);

//         // //Balance of TokenB at addr1 before swapping
//         // let tokenBBalance = await token2.balanceOf(addr1.address);
//         // console.log("\nAddr1 receives TokenB balance Before Swap: ", tokenBBalance.toString());

//         // //swapping would be done for TokenB
//         // let swapForB = await router.swapExactTokensForTokens(tokenCBalance, minB, [token3.address, token2.address], addr1.address, 1692742340);
//         // console.log("After swapping TokenA for TokenC array of amounts :- \n", swapForC[0], "\n");

//         // //Balance of TokenB at addr1 after swapping
//         // tokenBBalance = await token2.balanceOf(addr1.address);
//         // console.log("\nAddr1 receives TokenB balance After Swap: ", tokenBBalance.toString());



//     });

// });


