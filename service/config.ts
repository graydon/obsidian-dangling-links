import { NAVIGATION_TAB, SORT_ORDER } from '../constants'
import type { Plugin } from 'obsidian';

export interface DanglingSettings {
    selectedTab: NAVIGATION_TAB;
    sortOrder: SORT_ORDER;
    reducedIndices: string[];
    ignoredFolders: string[]
}
export namespace Config {
    let plugin: Plugin;
    let settings: DanglingSettings;

    const DEFAULT_SETTINGS : DanglingSettings = {
        selectedTab: NAVIGATION_TAB.FILE,
        sortOrder: SORT_ORDER.ASC,
        reducedIndices: [],
        ignoredFolders: []
    };
    export async function loadSettings(plugin: Plugin) {
        this.plugin = plugin;
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await plugin.loadData()
        );
    }

    export function getSettings(): DanglingSettings { return this.settings; }
    export function saveSettings(): void { this.plugin.saveData(this.settings); }
}
