<script lang="ts">
  import Tabs from "$lib/components/Items/Tabs.svelte";

  interface Props {
    textures: { [key: string]: DataView };
  }

  let { textures }: Props = $props();
</script>

<div class="gtc-textureviewer">
  <Tabs
    item={{
      type: "tabs",
      vertical: true,
      items: Object.keys(textures).map((name) => ({
        name,
        items: [
          {
            type: "component",
            component: "Texture",
            props: {
              dataView: textures[name],
            },
          },
        ],
      })),
    }}
  />
</div>

<style lang="postcss">
  @reference "../../../../../app.css";

  .gtc-textureviewer {
    @apply h-full w-screen max-w-5xl overflow-auto;
  }
</style>
