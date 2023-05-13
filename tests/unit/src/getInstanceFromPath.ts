// Sample code for getInstanceFromPath for $readFile and $readFileOpt

export function getInstanceFromPath(entries: string[], useWaitForChild: boolean, exactPath: boolean) {
  let currentObject: Instance | undefined;
  let parent = game;

  // For client side stuff only
  if (!exactPath && game.GetService("RunService").IsClient()) {
    const first = entries[0];
    if (first === "StarterPlayer") {
      currentObject = game.GetService("Players").LocalPlayer;
      parent = currentObject;
    }
  }
}
