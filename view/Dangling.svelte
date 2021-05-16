<script lang="ts">

    import { afterUpdate, onDestroy } from "svelte";
    import type { Sortable } from "../controller/navigationItem";
    import type DanglingNavigationItem from "../controller/navigationItem";
    import type Dangle from "../model/dangle"
    export let dangling: [string, Dangle[]][];
    export let visitDangle: (dangle:Dangle) => void;
    export let navigationItems: DanglingNavigationItem[];
    export let sortableItems: Sortable[];
    export let redraw: () => void;
    import { Config } from '../service/config'

    $: {}
    let details = new Array<HTMLElement>();
    let  settings = Config.getSettings();
    let activeNavigation = sortableItems.find(element => element.tabIdentifier == settings.selectedTab);
    init();
    
    afterUpdate(() => {
        details = details.filter(detail => detail);
        details.forEach((detail)=> {
             if(settings.reducedIndices.contains(detail.id)) {
                 detail.removeAttribute("open");
            } 
             else {
                 detail.setAttribute("open", "open");
            }
        });
    });

    async function init() {
        settings = Config.getSettings()
        activeNavigation = sortableItems.find(element => element.tabIdentifier == settings.selectedTab);
        await redraw();
    }

    function handleClick(event) {
        event.onclick();
        init();
    }

    function expand(index) {
        if(settings.reducedIndices.contains(index)) {
            settings.reducedIndices.remove(index);
        } else {
            settings.reducedIndices.push(index);
        }
        Config.saveSettings();
    }

    onDestroy(() => null)

</script>

<div id="dangling-links" class="container">
<div class="nav-header">
    {#each navigationItems as navigationItem}
    <span  class="nav-action-button" on:click={() => handleClick(navigationItem)} title="{navigationItem.title}"><svg viewBox="0 0 100 100" class="folder" width="20" height="20">
    {#if navigationItem.tabIdentifier == settings.selectedTab }
    <path fill="currentColor" stroke-width="5" stroke="currentColor" d="{navigationItem.iconPath}"></path>
    {:else}
    <path fill="currentColor" stroke="currentColor" d="{navigationItem.iconPath}"></path>
    {/if} 
</svg></span>
    {/each}
</div>

<h3>Dangling links</h3>

{#each dangling as [index, dangles], cnt}
<details bind:this="{details[cnt]}" id="{index}" on:click={() => expand(index)}>

    <summary>{index}</summary>
        <ul>
            {#each dangles as dangle}
            {#if dangle.path != index}
            <li>({dangle.filename}) line {dangle.line + 1}: 
                "<a href="{dangle.link}" on:click={(e) => visitDangle(dangle)}>{dangle.link}</a>"
            </li>
            {:else}
            <li>line {dangle.line + 1}: 
                "<a href="{dangle.link}" on:click={(e) => visitDangle(dangle)}>{dangle.link}</a>"
            </li>
            {/if}
            {/each}
        </ul>
</details>  
{/each}
</div>