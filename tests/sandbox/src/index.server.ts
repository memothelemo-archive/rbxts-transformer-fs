import fs from "rbxts-transformer-fs";

fs.$dirExists("hello");

const fileHash = fs.$hashFile("bun.lockb", "md5");
print(fileHash);

fs.$expectPath("bun.lockb");
