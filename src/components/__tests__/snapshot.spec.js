import { it, expect, describe } from "vitest";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";

import SongItemHome from "@/components/SongItemHome.vue";

describe("Snapshots SongItemHome.vue", () => {
  it("Render correctly", () => {
    const song = {
      docId: "abc123",
      modifiedName: "test",
      userDisplayName: "test",
      commentCount: 4,
    };

    const wrapper = shallowMount(SongItemHome, {
      props: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
