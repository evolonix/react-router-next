import { describe, expect, it } from "vitest";
import { createTrigger } from "./watch";

function deferred<T = void>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
} {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

describe("createTrigger", () => {
  it("invokes onChange immediately when idle", async () => {
    let calls = 0;
    const trigger = createTrigger(() => {
      calls++;
    });

    await trigger();
    expect(calls).toBe(1);
  });

  it("coalesces re-entrant calls into a single pending rerun", async () => {
    let calls = 0;
    const inflight = deferred();

    const trigger = createTrigger(async () => {
      calls++;
      if (calls === 1) await inflight.promise;
    });

    // Start the first run — it awaits `inflight` and never resolves yet.
    const first = trigger();
    // Three quick triggers while the first is still running collapse into one.
    void trigger();
    void trigger();
    void trigger();

    // Let the first complete; the queued rerun fires once.
    inflight.resolve();
    await first;
    // Allow the pending rerun's microtasks to settle.
    await new Promise((r) => setTimeout(r, 0));

    expect(calls).toBe(2);
  });

  it("propagates synchronous throws without leaving running stuck", async () => {
    let calls = 0;
    const trigger = createTrigger(() => {
      calls++;
      if (calls === 1) throw new Error("boom");
    });

    await expect(trigger()).rejects.toThrow("boom");

    // Subsequent trigger should still fire — running state was cleared.
    await trigger();
    expect(calls).toBe(2);
  });

  it("clears the pending flag after dispatching the queued rerun", async () => {
    let calls = 0;
    const gate = [deferred(), deferred()];
    const trigger = createTrigger(async () => {
      const idx = calls;
      calls++;
      if (idx < gate.length) await gate[idx].promise;
    });

    const first = trigger();
    void trigger(); // queues a rerun
    // Both gates must be unblocked before awaiting `first` — the trigger's
    // `finally` awaits the recursive rerun, so `first` only resolves when the
    // whole chain has drained.
    gate[0].resolve();
    gate[1].resolve();
    await first;
    expect(calls).toBe(2);

    // A fresh trigger after the queue drained still fires (pending was cleared).
    await trigger();
    expect(calls).toBe(3);
  });
});
