/* eslint-disable @typescript-eslint/no-require-imports */

const workerThreads = require("worker_threads");
const { Worker } = require("next/dist/compiled/jest-worker");

const originalCallFunctionWithArgs = Worker.prototype._callFunctionWithArgs;

Worker.prototype._callFunctionWithArgs = function patchedCallFunctionWithArgs(
  method,
  ...args
) {
  const patchedArgs =
    method === "exportPages" ? args.map((arg) => sanitizeExportPagesInput(arg)) : args;

  return originalCallFunctionWithArgs.call(this, method, ...patchedArgs);
};

const originalPostMessage = workerThreads.Worker.prototype.postMessage;

workerThreads.Worker.prototype.postMessage = function patchedPostMessage(
  message,
  ...transferList
) {
  return originalPostMessage.call(
    this,
    stripFunctions(message),
    ...transferList
  );
};

function sanitizeExportPagesInput(input) {
  if (!input || typeof input !== "object") {
    return input;
  }

  return {
    ...input,
    nextConfig: stripFunctions(input.nextConfig),
    renderOpts: stripFunctions(input.renderOpts),
  };
}

function stripFunctions(value, seen = new WeakMap()) {
  if (typeof value === "function") {
    return undefined;
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (Array.isArray(value)) {
    const nextArray = [];
    seen.set(value, nextArray);

    for (const item of value) {
      nextArray.push(stripFunctions(item, seen));
    }

    return nextArray;
  }

  if (value instanceof Date) {
    return new Date(value);
  }

  if (value instanceof RegExp) {
    return new RegExp(value);
  }

  if (value instanceof Map) {
    const nextMap = new Map();
    seen.set(value, nextMap);

    for (const [key, item] of value.entries()) {
      if (typeof key === "function") {
        continue;
      }

      const nextValue = stripFunctions(item, seen);
      if (nextValue !== undefined) {
        nextMap.set(stripFunctions(key, seen), nextValue);
      }
    }

    return nextMap;
  }

  if (value instanceof Set) {
    const nextSet = new Set();
    seen.set(value, nextSet);

    for (const item of value.values()) {
      const nextValue = stripFunctions(item, seen);
      if (nextValue !== undefined) {
        nextSet.add(nextValue);
      }
    }

    return nextSet;
  }

  const nextObject = {};
  seen.set(value, nextObject);

  for (const [key, item] of Object.entries(value)) {
    if (typeof item === "function") {
      continue;
    }

    const nextValue = stripFunctions(item, seen);
    if (nextValue !== undefined) {
      nextObject[key] = nextValue;
    }
  }

  return nextObject;
}

process.argv = ["node", "next", "build", ...process.argv.slice(2)];

require("next/dist/bin/next");
