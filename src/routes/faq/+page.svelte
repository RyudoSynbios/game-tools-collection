<script lang="ts">
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>FAQ | Game Tools Collection</title>
  <meta property="og:title" content="FAQ" />
  <meta property="og:image" content="{$page.url.origin}/img/icon.png" />
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
    you can reach me on <a href="https://discord.gg/3UJeXtsryS"> Discord </a>
    or at
    <a href="mailto:contact@game-tools-collection.com">
      contact@game-tools-collection.com
    </a>.
  </p>
  <h2>- What files are supported by Save Editors?</h2>
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
      <strong>Nintendo DS: </strong>.dsv, .sav, .dss, .dst, .duc (<i
        >Action Replay Max DS</i
      >)
    </li>
    <li>
      <strong>Nintendo Entertainment System: </strong>.sav, .srm
    </li>
    <li>
      <strong>Super Nintendo: </strong>.sav, .srm
    </li>
    <li>
      <strong>Nintendo 64: </strong>.eep, .fla, .sra, .srm, .n64 (<i>DexDrive</i
      >)
    </li>
    <li>
      <strong>GameCube: </strong>.gci
    </li>
    <li>
      <strong>Dreamcast: </strong>.bin (<i>VMU raw dump</i>), .cdi
    </li>
    <li>
      <strong>Mega Drive: </strong>.sav, .srm
    </li>
    <li>
      <strong>Sega Saturn: </strong>.bcr, .bkr, .bin
    </li>
    <li>
      <strong>PlayStation: </strong>.mcr, .srm, .psv (<i>PlayStation 3</i>),
      .vmp (<i>PlayStation Classic</i>), .gme (<i>DexDrive</i>)
    </li>
    <li>
      <strong>PlayStation 2: </strong>.ps2
    </li>
    <li>
      <strong>PlayStation Portable: </strong>Mostly .bin
    </li>
    <li>
      <strong>PC-Engine CD: </strong>.sav, .srm
    </li>
  </ul>
  <h2>- My save file from an Everdrive won't load (Nintendo 64)</h2>
  <p>Everdrive save files can be byteswapped. You can follow those steps:</p>
  <p>
    Open this <a href="/tools/byteswap" target="_blank">page</a> and upload you're
    save file. Your file will be converted and downloaded automatically.
  </p>
  <p>
    Your save file should now work with the save editor. Once you're done
    editing, use the same tool to convert your file back.
  </p>
  <h2>- My .bcr file won't load (Sega Saturn)</h2>
  <p>Your save file may be compressed.</p>
  <p>
    Try changing the extension to <strong>*.gz</strong>, then decompress it.
  </p>
  <h2>- How can i edit my PSP save?</h2>
  <p>
    PSP save files are encrypted by default when exported from a PSP or
    generated with PPSSPP. You need to decrypt your save in order to edit it.
  </p>
  <p>If you're save has been generated with PPSSPP, follow those steps:</p>
  <p>
    Open the <strong>memstick</strong>
    folder (on the root of the PPSSPP folder by default).
  </p>
  <p>
    Navigate to
    <strong>PSP</strong>
    > <strong>SYSTEM</strong>, then open the <strong>ppsspp.ini</strong> file in
    a text editor.
  </p>
  <p>
    You should find a <strong>EncryptSave = True</strong> line. Replace
    <strong>True</strong>
    by <strong>False</strong> then save and quit.
  </p>
  <p>Now launch your game on PPSSPP, open your save and save again.</p>
  <p>Now your save should be decrypted.</p>
</div>

<style lang="postcss">
  .gtc-faq {
    @apply mt-4 rounded bg-primary-900 p-4 text-white;

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
