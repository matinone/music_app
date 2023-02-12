import { it, expect, describe } from "vitest";
import { shallowMount } from "@vue/test-utils";

import HomeView from "@/views/HomeView.vue";
import SongItemHome from "@/components/SongItemHome.vue";

describe("HomeView.vue", () => {
  it("Render list of songs", () => {
    const songs = [{}, {}, {}];

    const component = shallowMount(HomeView, {
      data() {
        return {
          songs,
        };
      },
      global: {
        mocks: {
          $t: (message) => message,
        },
      },
    });

    const items = component.findAllComponents(SongItemHome);

    expect(items).toHaveLength(songs.length);

    items.forEach((wrapper, index) => {
      expect(wrapper.props().song).toStrictEqual(songs[index]);
    });
  });
});
