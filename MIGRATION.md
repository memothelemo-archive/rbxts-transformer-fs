## Table of Contents

- [rbxts-transformer-fs v1 to v2.0.0](#for-rbxts-transformer-fs-v1xx-to-v200)
- [rbxts-transformer-path to v1](#for-rbxts-transformer-path-to-v100)

## For rbxts-transformer-fs v1.x.x to v2.0.0

1. Open your roblox-ts project with rbxts-transformer-fs within version 1 in it
2. Update the transformer:
```sh
# For NPM
npm i -D rbxts-transformer-fs@latest

# For Yarn
yarn add -D rbxts-transformer-fs@latest

# For PNPM
pnpm i -D rbxts-transformer-fs@latest

# For Bun
bun add -d rbxts-transformer-fs@latest
```

3. Replace functions that are deprecated
- `$requireFile` -> `$expectFile` (it functions the same)

  By the way, you can make your own custom error messages instead of
  generic one provided by transformer. You can do this by adding extra
  argument from `$expectFile`:

  ```ts
  import { $expectFile, $requireFile } from "rbxts-transformer-fs";

  // It gives generic error, it's boring...
  $requireFile("confidental-docs.txt");

  // That sounds more like it.
  $expectFile("confidental-docs.txt", "Why?");
  ```

- `$fileContents` -> `$readFile` (it functions the same)
- `$fileName` -> `$CURRENT_FILE_NAME` (it functions the same)
- `$instanceWaitFor` -> `$waitForInstance` (it functions the same)

4. Changes made from v1.2.0
- `$instance` and `$instanceWaitFor` checks for the tree structure of the type specified on runtime.
  
  If you want macro functions that will keep the same functionality as v1.x.x,
  we have one with `$instanceAny` and `$waitForInstanceAny`. This is not going to check for any tree type mismatches on runtime.

- `$resolvePath` is removed without warning or not being deprecated.

  If you want to replicate the same way as `$resolvePath`, you can code like this:
  ```ts
  import { $fileExists } from "rbxts-transformer-fs";

  if ($fileExists("hello.txt")) {
    print("File exists");
  } else {
    print("Nope, it doesn't.");
  }
  ```
  *We added `$fileExists` to suit your needs.*

- Added directory utility functions

## For rbxts-transformer-path to `v1.0.0`

**MIGRATION TUTORIAL:**

1. Open your roblox-ts project (that has rbxts-transformer-path installed in it)
2. Uninstal the legacy transformer
```sh
# If you choose package managers other than NPM
# you may want to translate this command here.
npm uninstall rbxts-transformer-path
```
3. Install with replacement transformer:
   - Follow this guide here in [README](README.md#installation)

**CHANGES:**

Removed functions:
- `$root` function is now removed (it does not make sense in this transformer)

Functions to change (arguments are the same thing):
- `$path` => `$instance`
- `$pathWaitFor` => `$instanceWaitFor`
