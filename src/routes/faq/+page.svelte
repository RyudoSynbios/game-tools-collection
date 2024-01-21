<script lang="ts">
</script>

<svelte:head>
  <title>FAQ | Game Tools Collection</title>
</svelte:head>

<div class="gtc-faq">
  <h1>FAQ</h1>
  <h2>- How can i repair my corrupted save?</h2>
  <p>
    Most games use checksums to validate if a save has been altered or not.
    Checksums are values calculated by making more or less complex operations on
    all the data in the save file.
  </p>
  <p>
    When you load your save, the game will calculate the checksum and compare
    with what it saved previously. If the result is the same, the save can be
    loaded, otherwise, it is indicated as corrupted and depending on the game,
    the save can be deleted.
  </p>
  <p>
    The tools present on the site recalculate the checksums every time you save,
    even if you don't edit anything, which can repair your save if it is
    corrupted.
  </p>
  <h2>
    - Is it possible to load save files made with GameSharks or other products?
  </h2>
  <p>In most cases, yes.</p>
  <p>
    Save editors can detect the format of a save file and adapt the values to
    allow the edition.
  </p>
  <p>
    If you are in possession of a save file that is not recognized by the tools,
    you can contact me at <a href="mailto:contact@game-tools-collection.com">
      contact@game-tools-collection.com
    </a>.
  </p>
  <h2>- What files are supported for Save Editors?</h2>
  <ul>
    <li>
      <strong>Game Boy: </strong>.sav, .srm
    </li>
    <li>
      <strong>Game Boy Color: </strong>.sav, .srm
    </li>
    <li>
      <strong>Game Boy Advance: </strong>.sav, .srm, .sps (<i>GameShark</i>)
    </li>
    <li>
      <strong>Super Nintendo: </strong>.sav, .srm
    </li>
    <li>
      <strong>Nintendo 64: </strong>.eep, .fla, .sra, .srm, .n64 (<i>DexDrive</i
      >)
    </li>
    <li>
      <strong>Dreamcast: </strong>.bin (<i>VMU raw dump</i>), .cdi
    </li>
    <li>
      <strong>Mega Drive: </strong>.sav, .srm
    </li>
    <li>
      <strong>Sega Saturn: </strong>.bkr (<i>System saves</i>)
    </li>
    <li>
      <strong>PlayStation: </strong>.mcr, .srm, .psv (<i>PlayStation 3</i>),
      .vmp (<i>PlayStation Classic</i>), .gme (<i>DexDrive</i>)
    </li>
    <li>
      <strong>PC-Engine CD: </strong>.sav, .srm
    </li>
  </ul>
</div>

<style lang="postcss">
  .gtc-faq {
    @apply mt-4 p-4 text-white bg-primary-900 rounded;

    h2:not(:first-of-type) {
      @apply mt-8;
    }

    & p {
      @apply mb-4 text-sm;

      & a {
        @apply font-bold;
      }
    }

    & p:last-of-type {
      @apply m-0;
    }

    & ul {
      & li {
        @apply mb-1 text-sm;
      }
    }
  }
</style>
