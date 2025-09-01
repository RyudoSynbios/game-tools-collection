<script lang="ts">
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>About | Game Tools Collection</title>
  <meta property="og:title" content="About" />
  <meta property="og:image" content="{page.url.origin}/img/icon.png" />
</svelte:head>

<div class="gtc-about">
  <h1>A whole collection of tools to edit your favorite games!</h1>
  <h2>Welcome to this huge project!</h2>
  <p>
    It's often difficult to find a save editor for a specific game, you have to
    search different websites, download software that may not work on your
    device...
  </p>
  <p>
    The goal of this project is to centralize a large number of tools in the
    same place, working on any device as you only need a web browser!
  </p>
  <p>
    All tools are based on templates that reference all offsets of a rom/save
    file with the data type and other information to generate a form with all
    the input needed to edit the file. This way it is easy and fast to generate
    a tool for a game as you don't need to worry about the form UI.
  </p>
  <p>
    As the project has just started, it's far from finished, so many things may
    not be optimized and could change (interface, colors, etc.).
  </p>
  <p>
    Also, some tools can be not fully complete, so don't hesitate to come back
    from time to time to check the progress!
  </p>
</div>

<style lang="postcss">
  .gtc-about {
    @apply mt-4 rounded bg-primary-900 p-4 text-white;

    & p {
      @apply mb-4 text-sm;
    }

    & p:last-of-type {
      @apply m-0;
    }
  }
</style>
