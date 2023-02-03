// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { BigNumber } = require("@ethersproject/bignumber");


// describe("Create Pool and then Flashswap", async () => {
//     let owner,addr1,addr2; 
//     let router,factory,weth,flashswap, library;
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
//         router = await contract3.deploy(factory.address,weth.address);
//         await router.deployed();

//         tokenA = await ethers.getContractFactory("MyToken1");
//         token1 = await tokenA.deploy();

//         tokenB = await ethers.getContractFactory("MyToken2");
//         token2 = await tokenB.deploy();

//         tokenC = await ethers.getContractFactory("MyToken3");
//         token3 = await tokenC.deploy();

//         let contract4 = await ethers.getContractFactory("Flashswap");
//         flashswap = await contract4.deploy(token2.address, factory.address);
//         await flashswap.deployed();

//         await token1.approve(router.address, 100000);
//         await token2.approve(router.address, 100000);
//         await token3.approve(router.address, 100000);

//         console.log("Router Contract Address :- ", router.address);
//         console.log("TokenA Contract Address :- ", token1.address);
//         console.log("TokenB Contract Address :- ", token2.address);
//         console.log("TokenC Contract Address :- ", token3.address);
//         console.log("Flashswap Contract Address :- ", flashswap.address);
//         // console.log("Uniswap Library Address :- ", library.address);

//         await token1.mint(100000);
//         await token2.mint(100000);
//         await token3.mint(100000);

//     });
//     // it("Liquidity Pool of Token A and Token B", async () => {
//     //     let tx = await router.addLiquidity(token1.address, token2.address, 10000, 10000, 10, 10, owner.address, 1694624992);
//     //     console.log(tx);
//     // });
//     it("Flash Swap", async () => {

//         //AddLiquidity for pair TokenA and TokenB
//         let ab = await router.addLiquidity(token1.address, token2.address, 10000, 10000, 10, 10, owner.address, 1692742340);
//         console.log(ab,"\n");

//         //AddLiquidity for pair TokenA and TokenC
//         let ac = await router.addLiquidity(token1.address, token3.address, 10000, 20000, 0, 0, owner.address, 1692742340);
//         console.log(ac,"\n");


//         //AddLiquidity for pair TokenB and TokenC
//         let bc = await router.addLiquidity(token2.address, token3.address, 20000, 10000, 0, 0, owner.address, 1692742340);
//         console.log(bc, "\n");

//         //Perform flashswap for borrowedAmount 1000 of TokenA 
//         //flashwap contracts prints the TokenA amount received by flashswap contract 
//         const fee = Math.round(((borrowAmount * 3) / 997)) + 1;
//         await token1.transfer(flashswap.address, fee);
//         await flashswap.testFlashSwap(token1.address, borrowAmount);
//         const flashswapBalance = await token1.balanceOf(flashswap.address);
//         expect(flashswapBalance.eq(BigNumber.from("0"))).to.be.true;

//         //calling getAmountsOut function to get the amountOutMin parameter for swapExactTokensForTokens
//         let [minC, maxC] = await router.getAmountsOut(borrowAmount, [token1.address, token3.address]);
//         console.log("Min of out TokenC :- ", minC);
//         console.log("Max of out TokenC :- ",maxC);

//         //////////////////////Exchange that recieved TokenA for TokenC
//         //Balance of TokenC at addr1 before swapping
//         let tokenCBalance = await token3.balanceOf(addr1.address);
//         console.log("\nAddr1 receives TokenC balance Before Swap: ", tokenCBalance.toString());

//         //swapping would be done for TokenC
//         let swapForC = await router.swapExactTokensForTokens(borrowAmount, minC, [token1.address, token3.address], addr1.address, 1692742340);
//         console.log("After swapping TokenA for TokenC array of amounts :- \n",swapForC[0], "\n");

//         //Prints the amount of TokenC received by addr1 after swapping
//         tokenCBalance = await token3.balanceOf(addr1.address);
//         console.log("\nAddr1 receives TokenC balance After Swap: ", tokenCBalance.toString());

//         ////////////////////////////////Again swap that received TokenC for TokenB//////////////////////////////////
//         //calling getAmountsOut function to get the amountOutMin parameter for swapExactTokensForTokens
//         let [minB, maxB] = await router.getAmountsOut(tokenCBalance, [token3.address, token2.address]);
//         console.log("Min of out TokenB :- ", minB);
//         console.log("Max of out TokenB :- ", maxB);

//         //Balance of TokenB at addr1 before swapping
//         let tokenBBalance = await token2.balanceOf(addr1.address);
//         console.log("\nAddr1 receives TokenB balance Before Swap: ", tokenBBalance.toString());

//         //swapping would be done for TokenB
//         let swapForB = await router.swapExactTokensForTokens(tokenCBalance, minB, [token3.address, token2.address], addr1.address, 1692742340);
//         console.log("After swapping TokenA for TokenC array of amounts :- \n", swapForC[0], "\n");

//         //Balance of TokenB at addr1 after swapping
//         tokenBBalance = await token2.balanceOf(addr1.address);
//         console.log("\nAddr1 receives TokenB balance After Swap: ", tokenBBalance.toString());

//         ////////////////////////////        At the end swap tokenB for tokenA
//         let [minA, maxA] = await router.getAmountsOut(borrowAmount, [token2.address, token1.address]);
//         console.log("Min of out TokenA :- ", minA);
//         console.log("Max of out TokenA :- ", maxA);

//         //Balance of TokenA at addr1 before swapping
//         let tokenABalance = await token1.balanceOf(addr1.address);
//         console.log("\nAddr1 receives TokenA balance Before Swap: ", tokenABalance.toString());

//         //swapping would be done for TokenA
//         let swapForA = await router.swapExactTokensForTokens(borrowAmount, minA, [token2.address, token1.address], addr1.address, 1692742340);
//         console.log("After swapping TokenB for TokenA array of amounts :- \n", swapForC[0], "\n");

//         //Balance of TokenA at addr1 after swapping
//         tokenABalance = await token1.balanceOf(addr1.address);
//         console.log("\nAddr1 receives TokenA balance After Swap: ", tokenABalance.toString());
//     });
    
// });

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { BigNumber } = require("@ethersproject/bignumber");


// describe("Create Pool and then Flashswap", async () => {
//     let owner, addr1, addr2;
//     let router, factory, weth, flashswap;
//     let tokenA, tokenB, tokenC;
//     let token1, token2, token3;
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

//         let contract4 = await ethers.getContractFactory("Flashswap");
//         flashswap = await contract4.deploy(factory.address);
//         await flashswap.deployed();

//         await token1.approve(router.address, 100000);
//         await token2.approve(router.address, 100000);
//         await token3.approve(router.address, 100000);

//         console.log("Factory Contract Address :- ", factory.address);
//         console.log("Router Contract Address :- ", router.address);
//         console.log("TokenA Contract Address :- ", token1.address);
//         console.log("TokenB Contract Address :- ", token2.address);
//         console.log("TokenC Contract Address :- ", token3.address);
//         console.log("Flashswap Contract Address :- ", flashswap.address);

//         await token1.mint(100000);
//         await token2.mint(100000);
//         await token3.mint(100000);

//     });
//     it("Flash Swap", async () => {

//         //AddLiquidity for pair TokenA and TokenB
//         let ab = await router.addLiquidity(token1.address, token2.address, 10000, 10000, 10, 10, flashswap.address, 1692742340);
//         console.log(ab, "\n");

//         let pool1 = await factory.getPair(token1.address, token2.address);
//         console.log("Pool1 :- ",pool1);

//         const flashswapBalanceBefore = await token1.balanceOf(flashswap.address);
//         console.log("FLashswap Balance before swap :- ",flashswapBalanceBefore);

//         await token1.transfer(flashswap.address, 10000);
//         await token2.transfer(flashswap.address, 10000);

//         console.log("Calling performFlashSwap\n");
//         console.log(token1.address);
//         console.log(token2.address);
//         console.log(pool1);
//         await flashswap.performFlashSwap(token1.address, token2.address, pool1);

//         const flashswapBalanceAfter = await token1.balanceOf(flashswap.address);
//         console.log("FLashswap Balance after swap :- ", flashswapBalanceAfter);
//         expect(flashswapBalanceAfter.toString()).to.equal("100");
//     });

// });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { BigNumber } = require("@ethersproject/bignumber");


// describe("Create Pool and then Flashswap", async () => {
//     let owner, addr1, addr2;
//     let router, factory, weth, flashswap;
//     let tokenA, tokenB, tokenC;
//     let dai, wethh, token3;
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
//         dai = await tokenA.deploy();

//         tokenB = await ethers.getContractFactory("MyToken2");
//         wethh = await tokenB.deploy();

//         tokenC = await ethers.getContractFactory("MyToken3");
//         token3 = await tokenC.deploy();

//         let contract4 = await ethers.getContractFactory("Flashswap");
//         flashswap = await contract4.deploy(factory.address, dai.address, wethh.address);
//         await flashswap.deployed();

//         await dai.approve(router.address, 100000);
//         await wethh.approve(router.address, 100000);
//         await token3.approve(router.address, 100000);

//         console.log("Factory Contract Address :- ", factory.address);
//         console.log("Router Contract Address :- ", router.address);
//         console.log("TokenA Contract Address :- ", dai.address);
//         console.log("TokenB Contract Address :- ", wethh.address);
//         console.log("TokenC Contract Address :- ", token3.address);
//         console.log("Flashswap Contract Address :- ", flashswap.address);

//         await dai.mint(100000);
//         await wethh.mint(100000);
//         await token3.mint(100000);

//         let ab = await router.addLiquidity(dai.address, wethh.address, 10000, 10000, 10, 10, flashswap.address, 1692742340);
//         console.log(ab, "\n");

//     });
//     it("Should flash swap WETH for DAI", async function () {
//         const amountToSwap = 100; //ethers.utils.parseEther("1");

//         const daiBalanceBefore = await dai.balanceOf(flashswap.address);
//         const wethBalanceBefore = await wethh.balanceOf(flashswap.address);

//         // let addressPair = await flashswap.callPair();
        
//         await flashswap.flashSwap(amountToSwap);
//         // console.log("******************************************PAIR : ",addressPair);

//         const daiBalanceAfter = await dai.balanceOf(flashswap.address);
//         const wethBalanceAfter = await wethh.balanceOf(flashswap.address);

//         // expect(daiBalanceAfter).to.be.above(daiBalanceBefore);
//         // expect(wethBalanceAfter).to.be.below(wethBalanceBefore);
//     });

//     // it("Should repay WETH after flash swap", async function () {

//     //     const amountToSwap = 100;

//     //     const wethBalanceBefore = await wethh.balanceOf(flashswap.address);

//     //     await flashswap.flashSwap(amountToSwap);

//     //     const amountToRepay = await flashswap.amountToRepay();
//     //     await wethh.transfer(flashswap.address, amountToRepay);

//     //     const wethBalanceAfter = await wethh.balanceOf(flashswap.address);

//     //     expect(wethBalanceAfter).to.be.equal(wethBalanceBefore);
//     // });

// });
///////////////////////////////////////////////////////
///////////////////////////////////
//////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");


describe("Create Pool and then Flashswap", async () => {
    let owner, addr1, addr2;
    let router, factory, weth, flashswap, library;
    let tokenA, tokenB, tokenC;
    let token1, token2, token3;

    let borrowAmount = 1000; //1,00,000 - 1000
    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();

        let contract1 = await ethers.getContractFactory("UniswapV2Factory");
        factory = await contract1.deploy(owner.address);
        await factory.deployed();

        let contract2 = await ethers.getContractFactory("WETH9");
        weth = await contract2.deploy();
        await weth.deployed();

        let contract3 = await ethers.getContractFactory("UniswapV2Router02");
        router = await contract3.deploy(factory.address, weth.address);
        await router.deployed();

        tokenA = await ethers.getContractFactory("MyToken1");
        token1 = await tokenA.deploy();

        tokenB = await ethers.getContractFactory("MyToken2");
        token2 = await tokenB.deploy();

        tokenC = await ethers.getContractFactory("MyToken3");
        token3 = await tokenC.deploy();

        let contract4 = await ethers.getContractFactory("Flashswap");
        flashswap = await contract4.deploy(factory.address, router.address, token1.address, token2.address, token3.address);
        await flashswap.deployed();

        // await token1.approve(router.address, 100000);
        // await token2.approve(router.address, 100000);
        // await token3.approve(router.address, 100000);

        console.log("Router Contract Address :- ", router.address);
        console.log("TokenA Contract Address :- ", token1.address);
        console.log("TokenB Contract Address :- ", token2.address);
        console.log("TokenC Contract Address :- ", token3.address);
        console.log("Flashswap Contract Address :- ", flashswap.address);
        // console.log("Uniswap Library Address :- ", library.address);

        await token1.mint(1000000);
        await token2.mint(1000000);
        await token3.mint(1000000);
        

    });
    // it("Liquidity Pool of Token A and Token B", async () => {
    //     let tx = await router.addLiquidity(token1.address, token2.address, 10000, 10000, 10, 10, owner.address, 1694624992);
    //     console.log(tx);
    // });
    it("Flash Swap", async () => {
        await token1.approve(flashswap.address, 1000000);
        await token2.approve(flashswap.address, 1000000);
        await token3.approve(flashswap.address, 1000000);

        await flashswap.testFlashSwap(token1.address, borrowAmount);
        const flashswapBalance = await token1.balanceOf(flashswap.address);
        console.log("Flashswap Balance from testing ",flashswapBalance);
        // expect(flashswapBalance.eq(BigNumber.from("0"))).to.be.true;
    });

});

