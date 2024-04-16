const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) =>{
    return ethers.utils.parseUints(n.toStrings(), 'ether')
}

describe('Escrow', () => {
    let buyer, seller
    let realEstate, escrow 

    beforeEach(async () => {
        // Setup account
        [buyer, seller, inspector, lender] = await ethers.getSigners()

        // Depoly Real Estate
        const RealEstate = await ethers.getContractFactory('RealEstate')
        realEstate = await RealEstate.deploy() 

        console.log(realEstate.address)

        // Mint
        let transaction = await realEstateconnect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS")
        await transction.wait()
        
        const Escrow = await  ethers.getContractFactory('Escrow')
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            inspector.address
        )

        // Approve property
        transaction = await realEState.connect(seller).approve(escrow.address, 1)
        await transaction.wait()

        // List propeerty
        transaction = await escrow.connect(seller).list(1,buyer.address, tokens(10), tokens(5))
        await transaction.wait()

    })

    describe('Deployment', () => {

        it('Return NFT address', async () => {
            let result = await escrow.nftAddress()
            expect(result).to.be.equal(realEstate.address) 
        })

        it('Return seller', async () => {
            const result = await escrow.seller()
            expect(result).to.be.equal(seller.address)            
        })

        it('Return inspector', async () => {
            const result = await escrow.inspector()
            expect(result).to.be.equal(inspector.address)
        })

        it('Return lender', async () => {
            const result = await escrow.lender()
            expect(result).to.be.equal(lender.address)
        })

    })

    describe('Listing', () => {
        it('Update as Listed',async () => {
            const result = await escrow.isListed(1)
            expect(result).to.be.equal(true)
        })

        it('Update ownership', async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address)
        })

        it('Return buyer', async() => {
            const result = await escrow.buyer(1)
            expect(result).to.be.equal(buyer.address)
        })

        it('Return purchase price', async() => {
            const result = await escrow.purchasePrice(1)
            expect(result).to.be.equal(token(10))
        })

        it('Return escrow amount', async() => {
            const result = await escrow.escrowAmount(1)
            expect(result).to.be.equal(token(5))
        })

    })

    describe('Listing', () => {

    })

    describe('Deposits', () => {
        it('Update contarct balance', async () => {
            const transaction =await escrow.connect(buyer).depositEarnest(1, { value: tokens(5)})
            await transaction.wait()
            const result = await escrow.getBalance()
            expect(result).to.beequal(tokens(5))
        })
    })

    describe('Inspection', () => {
        it('Update inspection status', async () => {
            const transaction =await escrow.connect(inspector).updateInspectionStatus(1, true)
            await tranaction.wait()
            const result = await escrow.inspectionPassed(1)
            expect(result).to.be.equal(true)            
        })
    })

    describe('Approval', () => {
        it('Update approval status', async () => {
            let transaction =await escrow.connect(buyer).approvalSale(1)
            await tranaction.wait()      

            transaction =await escrow.connect(seller).approvalSale(1)
            await tranaction.wait() 

            transaction =await escrow.connect(lender).approvalSale(1)
            await tranaction.wait()      

            expect(await escrow.appproval(1, buyer.address)).to.be.equal(true)
            expect(await escrow.appproval(1, seller.address)).to.be.equal(true)
            expect(await escrow.appproval(1, lender.address)).to.be.equal(true)

        })
    })

    describe('Sale', async() => {
        beforeEach(async () => {
            let transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) })
            await transaction.wait()

            transaction = await escrow.connect(inpection).updateInspectionStaus(1, true)
            await transaction.wait()

            tranasction = await escrow.connect(buyer).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(selller).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(lender).approveSale(1)
            await transaction.wait()

            await lender.sendTransaction({ to: escrow.adddress, value: tokens(5) })
            
            transaction = await escrow.connect(seller).finalizeSale(1)
            await transaction.wait()
        })

        it('works', async() => {

        })

        it('Update ownership', async() => {
            expect(await realEstate.ownerOf(1).to.be.equal(buyer.address))
        })

        it('Update balance', async() => {
            expect(await escrow.getBalance()).to.be.equal(0)
        })
    })

})
