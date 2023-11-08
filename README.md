# synchronized-node

A simple and lightweight library to execute functions in a synchronized way, preventing concurrent calls to the same function.

## Installation

To install the library, run:

```bash
npm install synchronized-node
//or
yarn add synchronized-node
```

## Usage

To use the library, you need to import the `executeSynchronized` function from the module:

```typescript
import { executeSynchronized } from "synchronized-node";
//or
import executeSynchronized from "synchronized-node";
```

Then, you can pass any function and its arguments to the `executeSynchronized` function, which will return a promise that resolves to the result of the function. For example:

```typescript
import axios from "axios";

import { executeSynchronized } from "synchronized-node";

const getTime = async (): Promise<unknown> => {
  try {
    const {
      data: { hour, minute, seconds },
    } = await axios.get(
      "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Amsterdam"
    );

    return {
      hour,
      minute,
      seconds,
    };
  } catch (error) {
    throw error;
  }
};

const test = async (number: number) => {
  const response = await executeSynchronized(getNumber);

  console.log(number, response);
};

Promise.all([test(3), test(1), test(3)]);
```

The `executeSynchronized` function will ensure that only one instance of the same function is running at a time. If another call to the same function is made while it is still running, it will wait until the previous call is finished before executing. This is useful for preventing race conditions or data corruption when dealing with shared resources.

The library uses the function name as the key to identify the function. Therefore, the function passed to the `executeSynchronized` function must have a name. Anonymous functions or arrow functions are not supported.

The library implements synchronization using semaphores, using the function name as the flag to lock and unlock the function. This means that you can execute multiple functions in a synchronized way, as long as they have different names. For example:

```typescript
const test1 = async (number: number) => {
  // some async logic
  return number * 2;
};

const test2 = async (number: number) => {
  // some async logic
  return number * 3;
};

executeSynchronized(test1, 1);
executeSynchronized(test1, 2);

executeSynchronized(test2, 1);
executeSynchronized(test2, 2);

// the function test1 with value 2 will wait for the execution of the function test1 with value 1 to finish
// the function test2 with value 2 will wait for the execution of the function test2 with value 1 to finish
// the function test2 with any value will not wait for the execution of the function test1 with any value
```

## License

This library is licensed under the MIT License. See the [LICENSE](https://github.com/AlecsFarias/synchronized-nodejs/blob/master/LICENSE) file for more details.
