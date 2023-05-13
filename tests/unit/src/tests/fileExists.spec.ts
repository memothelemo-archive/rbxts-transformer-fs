import fs from "rbxts-transformer-fs";

export = () => {
  it("should return false if the file does not exists", () => {
    expect(fs.$fileExists("samples/NotFound.txt")).to.be.equal(false);
  });

  it("should return false if the specified path is a directory", () => {
    expect(fs.$fileExists("samples")).to.be.equal(false);
  });

  it("should return true if specified file exists", () => {
    expect(fs.$fileExists("samples/HelloWorld.txt")).to.be.equal(true);
  });
};
