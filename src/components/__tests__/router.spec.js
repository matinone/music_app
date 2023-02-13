import { it, expect, describe } from "vitest";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";

import SongItemHome from "@/components/SongItemHome.vue";

describe("Router", () => {
  it("Render router link", () => {
    const song = {
      docId: "abc123",
    };

    const wrapper = shallowMount(SongItemHome, {
      props: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    const routerLink = wrapper.findComponent(RouterLinkStub);
    expect(routerLink.props().to).toEqual({
      name: "song",
      params: { id: song.docId },
    });
  });
});
