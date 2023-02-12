import { it, expect, describe } from "vitest";
import { shallowMount } from "@vue/test-utils";

import About from "@/views/AboutView.vue";

describe("About.vue", () => {
  it("Renders inner text", () => {
    const wrapper = shallowMount(About);

    expect(wrapper.text()).toContain("about");
  });
});
