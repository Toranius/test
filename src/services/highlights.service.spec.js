const { expect } = require("chai");
const sinon = require("sinon");
const rp = require("request-promise");

const cacheService = require("./cache.service");

const { getMergedHighlights } = require("./highlights.service");

describe("highlights service", () => {
  let rpGetStub = null;

  beforeEach(() => {
    process.env.INVESTOR_URL = "investorURL";
    process.env.GLOBAL_URL = "globalURL";
    rpGetStub = sinon.stub(rp, "get");
  });

  afterEach(() => {
    delete process.env.INVESTOR_URL;
    delete process.env.GLOBAL_URL;
    rpGetStub.restore();
  });

  it("should return a list of highlights without duplicates", async () => {
    // Arrange
    const investorHighlights = [
      { name: "name-1", title: "title-name-1" },
      { name: "name-1", title: "title-name-1" }
    ];
    const globalHighlights = [
      { name: "name-3", title: "title-name-3" },
      { name: "name-4", title: "title-name-4" }
    ];
    rpGetStub.withArgs(process.env.INVESTOR_URL).resolves(investorHighlights);
    rpGetStub.withArgs(process.env.GLOBAL_URL).resolves(globalHighlights);

    // Act
    const highlights = await getMergedHighlights();

    // Assert
    expect(highlights).to.have.length(3);
    expect(highlights.find(h => h.name === "name-1")).to.not.be.undefined;
    expect(highlights.find(h => h.name === "name-3")).to.not.be.undefined;
    expect(highlights.find(h => h.name === "name-4")).to.not.be.undefined;
  });

  it("should return a list of highlights with max 10 element per name", async () => {
    // Arrange
    const investorHighlights = [
      { name: "name-1", title: "title-name-1" },
      { name: "name-1", title: "title-name-2" },
      { name: "name-1", title: "title-name-3" },
      { name: "name-1", title: "title-name-4" },
      { name: "name-1", title: "title-name-5" },
      { name: "name-1", title: "title-name-6" },
      { name: "name-1", title: "title-name-7" },
      { name: "name-1", title: "title-name-8" },
      { name: "name-1", title: "title-name-9" },
      { name: "name-1", title: "title-name-10" },
      { name: "name-1", title: "title-name-11" }
    ];
    rpGetStub.withArgs(process.env.INVESTOR_URL).resolves(investorHighlights);
    rpGetStub.withArgs(process.env.GLOBAL_URL).resolves([]);

    // Act
    const highlights = await getMergedHighlights();

    // Assert
    expect(highlights).to.have.length(10);
    highlights.forEach((h, index) => {
      expect(h.title).to.be.equal(`title-name-${index + 1}`);
    });
  });

  it("shoudl return a list of highlights respecting priority", async () => {
    // Arrange
    const investorHighlights = [
      { name: "name-1", title: "title-name-1" },
      { name: "name-1", title: "title-name-2" },
      { name: "name-1", title: "title-name-3" },
      { name: "name-1", title: "title-name-4" },
      { name: "name-1", title: "title-name-5" },
      { name: "name-1", title: "title-name-6" },
      { name: "name-1", title: "title-name-7" },
      { name: "name-1", title: "title-name-8" }
    ];
    const globalHighlights = [
      { name: "name-1", title: "title-name-9" },
      { name: "name-1", title: "title-name-10" },
      { name: "name-1", title: "title-name-11" }
    ];
    rpGetStub.withArgs(process.env.INVESTOR_URL).resolves(investorHighlights);
    rpGetStub.withArgs(process.env.GLOBAL_URL).resolves(globalHighlights);

    // Act
    const highlights = await getMergedHighlights();

    // Assert
    expect(highlights).to.have.length(10);
    highlights.forEach((h, index) => {
      expect(h.title).to.be.equal(`title-name-${index + 1}`);
    });
  });

  it("should return a list of highlights from cache", async () => {
    // Arrange
    const investorHighlights = [{ name: "name-1", title: "title-name-1" }];
    const globalHighlights = [{ name: "name-1", title: "title-name-9" }];
    rpGetStub.withArgs(process.env.INVESTOR_URL).resolves(investorHighlights);
    rpGetStub.withArgs(process.env.GLOBAL_URL).resolves(globalHighlights);
    cacheService
      .getCache()
      .setKey("highlight", [{ name: "test", title: "title-test" }]);

    // Act
    const highlights = await getMergedHighlights(true);

    // Assert
    expect(highlights).to.have.length(1);
    expect(highlights).to.be.deep.equal([
      { name: "test", title: "title-test" }
    ]);
  });
});
