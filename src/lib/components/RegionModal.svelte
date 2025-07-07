<script lang="ts">
  import { capitalize } from "$lib/utils/format";

  interface Props {
    regions: string[];
    onSubmit: (region: string) => void;
  }

  let { regions, onSubmit }: Props = $props();

  const regionsFormatted = Object.values(regions).reduce(
    (results: { id: string; name: string }[], region) => {
      const strings = region.split("_");

      strings.forEach((string) => {
        results.push({ id: region, name: capitalize(string) });
      });

      return results;
    },
    [],
  );

  const order = [
    "Europe",
    "USA",
    "Japan",
    "France",
    "Germany",
    "Italy",
    "Spain",
    "Australia",
    "Canada",
    "Korea",
    "Asia",
  ];

  regionsFormatted.sort(
    (a, b) => order.indexOf(a.name) - order.indexOf(b.name),
  );
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="gtc-regionmodal-backdrop">
  <div class="gtc-regionmodal">
    <p>Please select the region of your save file:</p>
    <ul>
      {#each regionsFormatted as region}
        <li onclick={() => onSubmit(region.id)}>
          {region.name}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style lang="postcss">
  @reference "../../app.css";

  .gtc-regionmodal-backdrop {
    @apply absolute inset-0 flex items-center justify-center bg-black/50 text-white;

    z-index: 10000;

    & .gtc-regionmodal {
      @apply bg-primary-900 flex flex-col items-center justify-center rounded-xl p-4;

      width: 600px;
      height: 400px;

      & p {
        @apply mb-2 font-bold;
      }

      & li {
        @apply cursor-pointer;
      }
    }
  }
</style>
