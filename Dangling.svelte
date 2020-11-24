<script lang="ts">
import { onDestroy } from "svelte";
import Dangle from "./dangle"
export let filesWithDangles: Map<string, Dangle[]>;
export let visitDangle: (path:string, dangle:Dangle) => void;
$: {}
onDestroy(() => null)
</script>

<style>
</style>

<div id="dangling-links" class="container">
<h3>Dangling links</h3>
<ul>
{#each Array.from(filesWithDangles.entries()).sort((a, b) => a[0].localeCompare(b[0])) as [path, dangles]}
    <li>{path}:
        <ul>
            {#each dangles as dangle}
            <li>line {dangle.line + 1}: "<a href="{path}" on:click={(e) => visitDangle(path, dangle)}>{dangle.link}</a>"</li>
            {/each}
        </ul>
    </li>
{/each}
</ul>
</div>
