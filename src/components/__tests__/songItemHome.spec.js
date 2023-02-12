import { it, expect, describe } from "vitest";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";

import SongItemHome from "@/components/SongItemHome.vue";

describe("SongItemHome.vue", () => {
  it("Render uploaded by name", () => {
    const song = {
      userDisplayName: "Test Name",
    };
    const wrapper = shallowMount(SongItemHome, {
      props: {
        song,
      },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    const uploadedBy = wrapper.find(".text-gray-500");

    expect(uploadedBy.text()).toBe(`Uploaded by ${song.userDisplayName}`);
  });

  it("Render song.docId in id attribute", () => {
    const song = {
      docId: "abc123",
    };
    const wrapper = shallowMount(SongItemHome, {
      props: {
        song,
      },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    expect(wrapper.attributes().id).toBe(`song-id-${song.docId}`);
    expect(wrapper.classes()).toContain(`song-id-${song.docId}`);
  });
});
