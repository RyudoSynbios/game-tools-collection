<script lang="ts">
  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import { getFiles } from "$lib/utils/common/iso9660";

  let search = "";
  let indexType = "hexadecimal";
  let text = "";

  function handleIndexTypeChange(event: Event): void {
    indexType = (event.target as HTMLInputElement).value;
  }

  function handleSearchChange(event: Event): void {
    search = (event.target as HTMLInputElement).value;
  }

  $: {
    text = "";

    const files = getFiles();

    files
      .filter((file) => {
        if (search !== "") {
          return file.index + 2 === parseInt(search);
        }
        return file;
      })
      .sort((a, b) => a.index - b.index)
      .forEach((file) => {
        let index = `${file.index + 2}`;

        if (indexFormat === "hexadecimal") {
          index = (file.index + 2).toHex(4);
        }

        text += `<p><b>${index}:</b> ${file.name}</p>`;
      });
  }
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
      label="Index Type"
      value={indexType}
      options={[
        { key: "hexadecimal", value: "Hexadecimal" },
        { key: "decimal", value: "Decimal" },
      ]}
      onChange={handleIndexTypeChange}
    />
  </div>
  <div class="gtc-filelist-content">
    {@html text}
  </div>
</div>

<style lang="postcss">
  .gtc-filelist {
    & .gtc-filelist-inputs {
      @apply flex;
    }

    & .gtc-filelist-content {
      @apply p-2 whitespace-pre-line bg-primary-700 rounded;
    }
  }
</style>
