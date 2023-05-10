# rbxts-transformer-fs

**rbxts-transformer-fs** is a transformer only works with roblox-ts compiler
where it allows you to call file system macros and transforms it into an output that
you really expect it to.

> *It's not really magic, actually. If you know C, C++, Rust and other programming languages that supports macros, think of it as that but it is like a plugin for roblox-ts compiler*

```ts
import fs from "rbxts-transformer-fs";

interface TycoonPrefab extends Model {
  Buttons: Folder;
}

// It allows to get an object with the target path
// and convert it to its Roblox tree with the power of Rojo
//
// Note that this will check if `assets/prefabs/tycoon.rbxmx`
// matches with the TycoonPrefab type. If you want to make it unsafe,
// I recommend to use `$instanceAny` instead.
const tycoon = fs.$instance<TycoonPrefab>("assets/prefabs/tycoon.rbxmx");

// How about we want to use WaitForChild with object? Let's say
// we want to load player's gui when they joined the game. Yes, you can!
const gui = fs.$waitForInstanceAny<ScreenGui>("assets/client/gui");

// You can also read files and directories
const twitterCodes = fs.$read("codes").split("\n");

// Maybe you need a specific file in order to compile, well yes you can!
fs.$expectFile("confidental-document");

// You can get the current file name with $CURRENT_FILE_NAME
// copied from 'rbxts-transform-debug'.
print(`[${fs.$CURRENT_FILE_NAME}] Hello world!`);
```

## Migrating from 1.0.0 or rbxts-transformer-path

See [MIGRATION.md](MIGRATION.md)

## Installation

1. Open your roblox-ts project that you want to install with this transformer
2. Install the transformer:
```sh
# For NPM
npm i -D rbxts-transformer-fs

# For Yarn
yarn add -D rbxts-transformer-fs

# For PNPM
pnpm i -D rbxts-transformer-fs

# For Bun
bun add -d rbxts-transformer-fs
```

3. Configure the transformer:
   - Go to the `tsconfig.json` in your preferred text editor and put the following under compilerOptions:

   ```json
   "plugins": [
   	{ "transform": "rbxts-transformer-fs" }
   ]
   ```

4. You're good to go!

<!-- ## Warning

- This transformer is a bit unstable at this stage. The owner of this package cannot ensure the reliability of this transformer (especially the `$json` function) -->
