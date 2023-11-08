type Params = unknown[];
type Func<T> = (...args: Params) => T;

class Synchronized {
  private static instance: Synchronized | null = null;
  private functionSemaphores: { [key: string]: boolean } = {};

  private constructor() {}

  private static getInstance(): Synchronized {
    if (!Synchronized.instance) {
      Synchronized.instance = new Synchronized();
    }
    return Synchronized.instance;
  }

  private async internalExecute<T>(fn: Func<T>, ...args: Params): Promise<T> {
    const functionName = fn.name;

    if (!functionName) {
      throw new Error("Function name not found.");
    }

    if (this.functionSemaphores[functionName]) {
      await new Promise((resolve) => {
        const checkSemaphore = () => {
          if (!this.functionSemaphores[functionName]) {
            resolve(undefined);
          } else {
            setTimeout(checkSemaphore, 10);
          }
        };
        checkSemaphore();
      });
    }

    try {
      this.functionSemaphores[functionName] = true;
      const result = await Promise.resolve(fn(...args));
      this.functionSemaphores[functionName] = false;
      return result;
    } catch (error) {
      this.functionSemaphores[functionName] = false;
      throw error;
    }
  }

  public static async execute<T>(fn: Func<T>, ...args: Params): Promise<T> {
    return Synchronized.getInstance().internalExecute(fn, ...args);
  }
}

export function executeSynchronized<T>(
  fn: Func<T>,
  ...args: Params
): Promise<T> {
  return Synchronized.execute(fn, ...args);
}

export default executeSynchronized;
