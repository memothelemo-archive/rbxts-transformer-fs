import ansi from "ansi-colors";
import { TransformerConfig } from "./config";

// I miss Rust especially tokio's tracing library
export namespace Log {
  export const enum Level {
    Debug,
    Trace,
    Info,
    Warn,
  }

  const HEADER_TRACE = ansi.magentaBright("TRACE");
  const HEADER_DEBUG = ansi.cyanBright("DEBUG");
  const HEADER_INFO = ansi.greenBright("INFO ");
  const HEADER_WARN = ansi.yellowBright("WARN ");

  const HEADER_RIGHT = ` ${ansi.bold("rbxts-transformer-fs")}: `;
  let currentLevel = Level.Warn;
  let indent = "";

  function writeHeader(level: Level) {
    let output;
    switch (level) {
      case Level.Trace:
        output = HEADER_TRACE;
        break;
      case Level.Debug:
        output = HEADER_DEBUG;
        break;
      case Level.Info:
        output = HEADER_INFO;
        break;
      case Level.Warn:
        output = HEADER_WARN;
        break;
    }
    process.stdout.write("[");
    process.stdout.write(output);
    process.stdout.write("]");
    process.stdout.write(HEADER_RIGHT);
    if (indent.length > 0) {
      process.stdout.write(indent);
    }
  }

  function log(level: Level) {
    return (text: string) => {
      if (currentLevel > level) return;
      if (text.endsWith("\n")) {
        text = text.substring(0, text.length - 1);
      }
      writeHeader(level);
      process.stdout.write(text);
      process.stdout.write("\n");
    };
  }

  export function resetIndent() {
    if (currentLevel === Level.Debug) indent = "";
  }

  export function pushIndent() {
    if (currentLevel === Level.Debug) indent += "    ";
  }

  export function popIndent() {
    if (currentLevel === Level.Debug)
      indent = indent.substring(4, indent.length);
  }

  export function canLog(level: Level) {
    return level <= currentLevel;
  }

  export function setFromConfig(cfg: TransformerConfig) {
    if (cfg.logLevel !== undefined) {
      switch (cfg.logLevel) {
        case "debug":
          currentLevel = Level.Debug;
          break;
        case "trace":
          currentLevel = Level.Trace;
          break;
        case "info":
          currentLevel = Level.Info;
          break;
        case "warn":
          currentLevel = Level.Warn;
          break;
          break;
        default:
          throw new Error("TODO: Handle other than logLevel");
      }
    }
  }

  export const trace = log(Level.Trace);
  export const debug = log(Level.Debug);
  export const info = log(Level.Info);
  export const warn = log(Level.Warn);
}
