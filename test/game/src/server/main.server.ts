import { $instance } from "rbxts-transformer-fs";
import { makeHello } from "shared/module";

/** Designed for games, not plugins */
function getInstanceFromPathGlobal(entries: string[], waitFor: boolean) {
  const isClient = game.GetService("RunService").IsClient();
  const firstEntry = entries.pop();

  if (firstEntry === undefined) {
  }

  // // Environment checks
  // const isClient = game.GetService("RunService").IsClient();
  // const firstEntry = entries.pop();
  // if (firstEntry === undefined) {
  //   error("[rbxts-transformer-fs]: Missing first path entry");
  // }
  // let pointer: Instance | undefined;
  // const lastParent = game;
  // if (isClient) {
  //   let modified = true;
  //   if (firstEntry === "StarterPlayer") {
  //     const inner = entries[1];
  //     if (inner === "StarterCharacterScripts") {
  //       const character = game.GetService("Players").LocalPlayer.Character;
  //       if (character === undefined) {
  //         if (waitFor) {
  //           warn("[rbxts-transformer-fs]: Waiting for character to load");
  //           (pointer as Player).CharacterAdded.Wait();
  //         }
  //       }
  //     }
  //   } else if (firstEntry === "StarterGui") {
  //     const character = game.GetService("Players").LocalPlayer.FindFirstChild("PlayerGui");
  //   } else if (firstEntry === "StarterPack") {
  //   } else {
  //     modified = false;
  //   }
  //   if (modified) {
  //     entries.pop();
  //     entries.pop();
  //   }
  // }
}

print(makeHello("main.server.ts"));
