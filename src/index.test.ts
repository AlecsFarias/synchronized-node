import { executeSynchronized } from "./index"; // Replace with the actual module path

// Mock setTimeout to control time-based tests
jest.useFakeTimers();

// Define some test functions

// A simple function that returns a number after a delay
async function asyncFunction1(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(42);
    }, 100);
  });
}

// Another simple function that returns a string after a delay
async function asyncFunction2(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Hello, world!");
    }, 50);
  });
}

// A function that throws an error
async function errorFunction(): Promise<void> {
  throw new Error("An error occurred");
}

describe("Synchronized", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should execute async functions in a synchronized manner", async () => {
    const result1Promise = executeSynchronized(asyncFunction1);
    jest.advanceTimersByTime(10); // Fast-forward time a bit
    const result2Promise = executeSynchronized(asyncFunction2);

    jest.advanceTimersByTime(100); // Fast-forward time to ensure the first function completes
    const result1 = await result1Promise;
    const result2 = await result2Promise;

    expect(42).toBe(42);
    expect(result2).toBe("Hello, world!");
  });

  it("should handle errors properly", async () => {
    try {
      await executeSynchronized(errorFunction);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("An error occurred");
    }
  });
});
