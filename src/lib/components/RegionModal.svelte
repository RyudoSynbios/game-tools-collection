<script lang="ts">
  import { camelCaseToString, capitalize } from "$lib/utils/format";

  export let regions: string[];
  export let onSubmit: (region: string) => void;

  const regionsFormatted = Object.values(regions).reduce(
    (results: { id: string; name: string }[], region) => {
      const strings = region.split("_");

      strings.forEach((string) => {
        results.push({
          id: region,
          name: capitalize(camelCaseToString(string)),
        });
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

  regionsFormatted.sort((a, b) => {
    let indexA = order.indexOf(a.name);
    let indexB = order.indexOf(b.name);

    if (indexA === -1) {
      indexA = 9999;
    }

    if (indexB === -1) {
      indexB = 9999;
    }

    return indexA - indexB;
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="gtc-regionmodal-backdrop">
  <div class="gtc-regionmodal">
    <p>Please select the region of your save file:</p>
    <ul>
      {#each regionsFormatted as region}
        <li on:click={() => onSubmit(region.id)}>
          {region.name}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style lang="postcss">
  .gtc-regionmodal-backdrop {
    @apply absolute inset-0 flex items-center justify-center bg-black/50 text-white;

    z-index: 10000;

    & .gtc-regionmodal {
      @apply flex flex-col items-center justify-center rounded-xl bg-primary-900 p-4;

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
