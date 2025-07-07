<script lang="ts">
  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import { getFiles } from "$lib/utils/common/iso9660";

  let search = $state("");
  let indexFormat = $state("hexadecimal");

  function handleIndexFormatChange(event: Event): void {
    indexFormat = (event.target as HTMLInputElement).value;
  }

  function handleSearchChange(event: Event): void {
    search = (event.target as HTMLInputElement).value;
  }

  const files = getFiles();

  const text = $derived.by(() => {
    let text = "";

    files
      .filter((file) => {
        if (search !== "") {
          return file.index === parseInt(search);
        }
        return file;
      })
      .sort((a, b) => a.index - b.index)
      .forEach((file) => {
        let index = `${file.index}`;

        if (indexFormat === "hexadecimal") {
          index = file.index.toHex(4);
        }

        text += `<p><b>${index}</b>: ${file.name}</p>`;
      });

    return text;
  });
</script>

<div class="gtc-filelist">
  <div class="gtc-filelist-inputs">
    <Input
      label="Search"
      type="text"
      placeholder="Index"
      value={search}
      onChange={handleSearchChange}
    />
    <Select
      label="Index Format"
      value={indexFormat}
      options={[
        { key: "hexadecimal", value: "Hexadecimal" },
        { key: "decimal", value: "Decimal" },
      ]}
      onChange={handleIndexFormatChange}
    />
  </div>
  <div class="gtc-filelist-content">
    {@html text}
  </div>
</div>

<style lang="postcss">
  @reference "../../../../../app.css";

  .gtc-filelist {
    & .gtc-filelist-inputs {
      @apply flex;
    }

    & .gtc-filelist-content {
      @apply bg-primary-700 rounded p-2 whitespace-pre-line;
    }
  }
</style>
