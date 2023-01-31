const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");


describe("AddLiquidity", async () => {
    let owner,addr1,addr2; 
    let router,factory,weth,flashswap;
    let tokenA;
    let tokenB;
    let token1;
    let token2;

    let borrowAmount = 1000; //1,00,000 - 1000
    beforeEach(async () => {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        let contract1 = await ethers.getContractFactory("UniswapV2Factory");
        factory = await contract1.deploy(owner.address);
        await factory.deployed();

        let contract2 = await ethers.getContractFactory("WETH9");
        weth = await contract2.deploy();
        await weth.deployed();

        let contract3 = await ethers.getContractFactory("UniswapV2Router02");
        router = await contract3.deploy(factory.address,weth.address);
        await router.deployed();

        tokenA = await ethers.getContractFactory("MyToken1");
        token1 = await tokenA.deploy();
        // TokenA = 0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6;
        // await token1.deployed();

        tokenB = await ethers.getContractFactory("MyToken2");
        token2 = await tokenB.deploy();
        // TokenB = 0x8a791620dd6260079bf849dc5567adc3f2fdc318;
        // await token2.deployed();

        let contract4 = await ethers.getContractFactory("Flashswap");
        flashswap = await contract4.deploy(token2.address, factory.address);
        await flashswap.deployed();

        await token1.approve(router.address,10000);
        await token2.approve(router.address,10000);
        console.log("Router Contract Address :- ", router.address);
        console.log("Token1 Contract Address :- ", token1.address);
        console.log("Token2 Contract Address :- ", token2.address);
        console.log("Flashswap Contract Address :- ", flashswap.address);
        await token1.mint(100000);
        await token2.mint(100000);
    });
    it("Liquidity", async () => {
        let tx = await router.addLiquidity(token1.address, token2.address, 10000, 8000, 10, 10, owner.address, 1694624992);
        console.log(tx);
    });
    it("Flash Swap", async () => {
        let tx = await router.addLiquidity(token1.address, token2.address,10000,8000,10,10,owner.address,1692742340);
        console.log(tx);
        
        const fee = Math.round(((borrowAmount * 3) / 997)) + 1;
        await token1.transfer(flashswap.address, fee);
        await flashswap.testFlashSwap(token1.address, borrowAmount);
        const flashswapBalance = await token1.balanceOf(flashswap.address);
        expect(flashswapBalance.eq(BigNumber.from("0"))).to.be.true;
    });
    
});


