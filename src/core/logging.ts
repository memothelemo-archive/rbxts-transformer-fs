import ansi from "ansi-colors";
import { TransformerConfig } from "./config";
import { PACKAGE_NAME } from "./constants";

namespace Log {
  export const enum LogLevel {
    Debug,
    Trace,
    Info,
    Warn,
    Error,
  }

  const HEADER_PER_LEVEL = new Map<LogLevel, string>([
    [LogLevel.Trace, ansi.magentaBright("TRACE")],
    [LogLevel.Debug, ansi.cyanBright("DEBUG")],
    [LogLevel.Info, ansi.greenBright("INFO ")],
    [LogLevel.Warn, ansi.yellowBright("WARN ")],
    [LogLevel.Error, ansi.redBright("ERROR")],
  ]);
  const HEADER_PREFIX = `${ansi.bold(PACKAGE_NAME)}`;

  let currentLevel = LogLevel.Error;
  let indent = "";

  function log(level: LogLevel) {
    return (text: string) => {
      if (currentLevel > level) return;
      const prefix = `[${HEADER_PER_LEVEL.get(level)}] ${HEADER_PREFIX}:${indent}`;
      process.stdout.write(`${prefix} ${text.replace(/\n/g, `\n${prefix}`)}\n`);
    };
  }

  export function resetIndent() {
    if (currentLevel === LogLevel.Debug) {
      indent = "";
    }
  }

  export function pushIndent() {
    if (currentLevel === LogLevel.Debug) {
      indent = indent.length === 0 ? "  ├─" : `${indent}────`;
    }
  }

  export function popIndent() {
    if (currentLevel === LogLevel.Debug) {
      indent = indent.substring(0, indent.length - 4);
    }
  }

  export function canLog(level: LogLevel) {
    return level <= currentLevel;
  }

  export function setFromConfig(cfg: TransformerConfig) {
    if (cfg.logLevel !== undefined) {
      switch (cfg.logLevel) {
        case "debug":
          currentLevel = LogLevel.Debug;
          break;
        case "trace":
          currentLevel = LogLevel.Trace;
          break;
        case "info":
          currentLevel = LogLevel.Info;
          break;
        case "warn":
          currentLevel = LogLevel.Warn;
          break;
        case "error":
          currentLevel = LogLevel.Error;
          break;
        default:
          throw new Error("TODO: Handle other than logLevel");
      }
    }
  }

  export const trace = log(LogLevel.Trace);
  export const debug = log(LogLevel.Debug);
  export const info = log(LogLevel.Info);
  export const warn = log(LogLevel.Warn);
  export const error = log(LogLevel.Error);
}

export = Log;
