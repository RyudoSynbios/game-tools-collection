<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Canvas from "$lib/utils/canvas";
  import { getFileData } from "../utils";
  import { isCpk } from "$lib/utils/common/saturn";
  import { getInt, getString } from "$lib/utils/bytes";

  // import { getVideosCanvas } from "../utils/cpk";

  export let assetIndex: number;

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  interface Cpk {
    film: Film;
    fdsc: Fdsc;
    stab: Stab;
  }

  interface Film {
    signature: string;
    length: number;
    formatVersion: string;
  }

  interface Fdsc {
    signature: string;
    length: number;
    videoCodec: string;
    videoHeight: number;
    videoWidth: number;
    videoBpp: number;
    audioChannels: number;
    audioSamplingResolution: number;
    audioCompression: number;
    audioSamplingFrequency: number;
  }

  interface Stab {
    signature: string;
    length: number;
    baseFramerate: number;
    sampleTableEntryCount: number;
    sampleTable: SampleEntry[];
  }

  interface SampleEntry {
    offset: number;
    length: number;
    sampleInfo1: number;
    sampleInfo2: number;
    cvidHeader: {
      flags: number;
      length: number;
      width: number;
      height: number;
      stripCount: number;
    };
  }

  // TODO: https://wiki.multimedia.cx/index.php/Sega_FILM
  async function updateCanvas(): Promise<void> {
    const dataView = getFileData("video", assetIndex);

    const cpk = {} as Cpk;

    // Film

    cpk.film = {} as Film;

    cpk.film.signature = getString(0x0, 0x4, "uint8", {}, dataView);
    cpk.film.length = getInt(0x4, "uint32", { bigEndian: true }, dataView);
    cpk.film.formatVersion = getString(0x8, 0x4, "uint8", {}, dataView);

    // FDSC

    cpk.fdsc = {} as Fdsc;

    cpk.fdsc.signature = getString(0x10, 0x4, "uint8", {}, dataView);
    cpk.fdsc.length = getInt(0x14, "uint32", { bigEndian: true }, dataView);
    cpk.fdsc.videoCodec = getString(0x18, 0x4, "uint8", {}, dataView);
    cpk.fdsc.videoHeight = getInt(0x1c, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    cpk.fdsc.videoWidth = getInt(0x20, "uint32", { bigEndian: true }, dataView);
    cpk.fdsc.videoBpp = getInt(0x24, "uint8", {}, dataView);
    cpk.fdsc.audioChannels = getInt(0x25, "uint8", {}, dataView);
    cpk.fdsc.audioSamplingResolution = getInt(0x26, "uint8", {}, dataView);
    cpk.fdsc.audioCompression = getInt(0x27, "uint8", {}, dataView);
    cpk.fdsc.audioSamplingFrequency = getInt(0x28, "uint16", { bigEndian: true }, dataView); // prettier-ignore

    cpk.stab = {} as Stab;

    cpk.stab.signature = getString(0x30, 0x4, "uint8", {}, dataView);
    cpk.stab.length = getInt(0x34, "uint32", { bigEndian: true }, dataView);
    cpk.stab.baseFramerate = getInt(0x38, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    cpk.stab.sampleTableEntryCount = getInt(0x3c, "uint32", { bigEndian: true }, dataView); // prettier-ignore

    cpk.stab.sampleTable = [
      ...Array(cpk.stab.sampleTableEntryCount).keys(),
    ].reduce((entries: SampleEntry[], index) => {
      const offset = cpk.film.length + getInt(0x40 + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
      const length = cpk.film.length + getInt(0x44 + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
      const sampleInfo1 = getInt(0x48 + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
      const sampleInfo2 = getInt(0x4c + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore

      entries.push({
        offset,
        length,
        sampleInfo1,
        sampleInfo2,
        cvidHeader: {
          flags: getInt(offset, "uint8", {}, dataView),
          length: getInt(offset + 0x1, "uint24", { bigEndian: true }, dataView),
          width: getInt(offset + 0x4, "uint16", { bigEndian: true }, dataView),
          height: getInt(offset + 0x6, "uint16", { bigEndian: true }, dataView),
          stripCount: getInt(offset + 0x8, "uint16", { bigEndian: true }, dataView), // prettier-ignore
        },
      });

      return entries;
    }, []);

    // If the sample info 1 field is set to all ones, the sample is an audio chunk. Otherwise, it is a video chunk. If it is a video chunk, the top bit of the 32-bit number specifies whether the chunk is an inter-coded or an intra-coded frame. 0=intra-coded (a.k.a. keyframe), 1=inter-coded. This is useful for seeking since it is a good idea to only jump to key frames when seeking through a file.
    // The rest of the first sample info field and the second sample info field pertain to framerate calculation. Refer to the section on FILM framerate calculation for more information on proper FILM playback using these sample info fields.

    // FILM Framerate Calculation
    // The STAB chunk contains a framerate base frequency in bytes 8-11. This frequency is expressed in ticks/second (Hz). Every video chunk has a frame tick count. For example, movie files in Panzer Dragoon I & II (FILM format versions 1.04 and 1.07, respectively) have a base frequency of 600 Hz. The frames have tick counts of 0, 20, 40, 60, 80, etc. Thus, there are 20 ticks between each successive frame.
    // (600 ticks/sec) / (20 ticks/frame) = 30 frames/second
    // However, not all FILM files exhibit such a nice, even framerate. Myst, for example, contains FILM files (version 1.01) with a base frequency of 30 Hz. Some of the frames skip 2, then 3 ticks. Here's a sample tick count progression: 0, 2, 5, 7, 10, 12, 15, 17...
    // Each STAB record has 2 32-bit sample info fields. For an audio chunk, sample info 1 is all ones and sample info 2 is always 1. For a video chunk, sample info 1 contains the keyframe bit (as described in the STAB section) and the absolute timestamp in clock ticks of the video frame with respect to the file's base frequency clock. The sample info 2 field contains the number of clock ticks until the next frame is rendered. This type of information would be particularly useful in an interrupt-driven, real-time multimedia system like, for instance, a video game console (such as the Sega Saturn).
    // It is important to note that an application that knows how to play FILM files can not assume a constant framerate. The files will not play correctly with such a method. It is also important to note that converting FILM files to file formats that only support constant framerates (such as AVI) is not a winning strategy. The converted file will not play correctly.

    console.log(cpk);

    // const videosCanvas = getVideosCanvas(assetIndex);

    // const sheet = generateGraphicsSheet(
    //   videosCanvas.width,
    //   videosCanvas.videos,
    // );

    // canvas.resize(sheet.width, sheet.height);

    // videosCanvas.videos.forEach((video, index) => {
    // const data = [];

    // canvas.addGraphic(
    //   "sprite",
    //   data,
    //   cpk.stab.sampleTable[0].cvidHeader.width,
    //   cpk.stab.sampleTable[0].cvidHeader.height,
    //   0,
    //   0,
    // );
    // });

    canvas.render();
  }

  onMount(async () => {
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("sprite", "image");

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
  });

  $: {
    assetIndex;

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-videoviewer">
  <div bind:this={canvasEl} />
</div>

<style lang="postcss">
  .gtc-videoviewer {
    @apply self-start p-2 w-fit bg-primary-700 rounded;
  }
</style>
