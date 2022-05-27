require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");

describe("Proxy", async () => {
  let owner;
  let proxy, logic;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const Logic = await ethers.getContractFactory("ReleaseV1");
    logic = await Logic.deploy();
    await logic.deployed();

    const Proxy = await ethers.getContractFactory("ProxyContract");
    proxy = await Proxy.deploy();
    await proxy.deployed();

    await proxy.setImplementation(logic.address);

    const abi = ["function initialize() public"];
    const proxied = new ethers.Contract(proxy.address, abi, owner);

    await proxied.initialize();
  });

  it("points to an implementation contract", async () => {
    expect(await proxy.callStatic.getImplementation()).to.eq(logic.address);
  });

  it("proxies calls to implementation contract", async () => {
    abi = [
      "function setValue(uint256 newValue) public",
      "function getValue() public view returns (uint256)",
    ];

    const proxied = new ethers.Contract(proxy.address, abi, owner);

    expect(await proxied.getValue()).to.eq("0x42");
  });

  it("cannot be initialized twice", async () => {
    abi = ["function initialize() public"];
    const proxied = new ethers.Contract(proxy.address, abi, owner);

    await expect(proxied.initialize()).to.be.revertedWith(
      "already initialized"
    );
  });

  it("allows to change implementations", async () => {
    const LogicV2 = await ethers.getContractFactory("ReleaseV2");
    logicv2 = await LogicV2.deploy();
    await logicv2.deployed();

    await proxy.setImplementation(logicv2.address);

    abi = [
      "function initialize() public",
      "function setValue(uint256 newValue) public",
      "function getValue() public view returns (uint256)",
      "function doMagic() public",
    ];

    const proxied = new ethers.Contract(proxy.address, abi, owner);

    await proxied.setValue(0x33);
    expect(await proxied.getValue()).to.eq("0x33");

    await proxied.doMagic();
    expect(await proxied.getValue()).to.eq("0x19");
  });
});
