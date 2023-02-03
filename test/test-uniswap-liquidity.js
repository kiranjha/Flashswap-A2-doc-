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

