import { it, expect, describe, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";

import useUserStore from "@/stores/user";

vi.mock("@/includes/firebase", () => ({
  auth: {
    signInWithEmailAndPassword: () => {
      Promise.resolve();
    },
  },
}));

describe("stores", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("Authenticate user", async () => {
    const store = useUserStore();

    expect(store.userLoggedIn).not.toBe(true);
    await store.authenticate("email", "password");
    expect(store.userLoggedIn).toBe(true);
  });
});
