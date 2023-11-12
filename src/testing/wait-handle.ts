export class WaitHandle {
  #enabled = false;

  #resolveCollection: (() => void)[] = [];

  constructor(enabled = true) {
    this.#enabled = enabled;
  }

  enable() {
    this.#enabled = true;
  }

  disable() {
    this.#enabled = false;
  }

  release() {
    for (const resolve of this.#resolveCollection) {
      resolve();
    }
    this.#resolveCollection = [];
  }

  wait(): Promise<void> {
    if (!this.#enabled) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.#resolveCollection.push(resolve);
    });
  }
}

type WaitHandleCollection<T extends string> = {
  [key in `${T}WaitHandle`]: WaitHandle;
} & {
  disableAllHandles: () => void;
};

export function createWaitHandleCollection<
  T extends string,
>(): WaitHandleCollection<T> {
  const map = new Map<string, WaitHandle>();
  return new Proxy(
    {},
    {
      get(_target, key: string): unknown {
        if (key === 'disableAllHandles') {
          return () => {
            for (const [_, handle] of map.entries()) {
              handle.disable();
            }
          };
        }

        const cachedHandle = map.get(key);
        if (cachedHandle) {
          return cachedHandle;
        }

        const newHandle = new WaitHandle(false);
        map.set(key, newHandle);
        return newHandle;
      },
    }
  ) as WaitHandleCollection<T>;
}
