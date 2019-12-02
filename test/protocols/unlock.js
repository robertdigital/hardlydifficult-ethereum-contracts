const { constants, protocols } = require("../..");

contract("protocols / unlock", accounts => {
  const unlockOwner = accounts[0];
  let unlockProtocol;

  before(async () => {
    unlockProtocol = await protocols.unlock.deploy(web3, unlockOwner);
  });

  it("Can create a lock and buy a key", async () => {
    console.log("a");
    const tx = await unlockProtocol.createLock(
      60 * 60 * 24, // expirationDuration (in seconds) of 1 day
      web3.utils.padLeft(0, 40), // tokenAddress for ETH
      web3.utils.toWei("0.01", "ether"), // keyPrice
      100, // maxNumberOfKeys
      "Test Lock", // lockName
      "0x000000000000000000000000", // salt
      {
        from: accounts[1]
      }
    );
    console.log("a1");

    const lock = await protocols.unlock.getLock(
      web3,
      tx.logs[1].args.newLockAddress
    );
    console.log("a2");
    console.log(await lock.keyPrice());
    console.log(await lock.unlockProtocol());
    console.log(await lock.maxNumberOfKeys());
    console.log(await lock.totalSupply());
    console.log(await lock.beneficiary());
    console.log(await lock.getHasValidKey(accounts[2]));
    console.log(await lock.expirationDuration());
    console.log(await lock.tokenAddress());
    console.log(await lock.isAlive());

    await lock.purchase(
      await lock.keyPrice(),
      accounts[2],
      constants.ZERO_ADDRESS,
      [],
      {
        from: accounts[2],
        value: await lock.keyPrice(),
        gas: constants.MAX_GAS
      }
    );
    console.log("a");

    const hasKey = await lock.getHasValidKey(accounts[2]);
    assert.equal(hasKey, true);
  });
});
