import type Dangle from '../model/dangle';
import { NAVIGATION_TAB, SORT_ORDER } from '../constants';
import { Config } from '../service/config';
import type { App } from 'obsidian';

export default abstract class DanglingNavigationItem {
    iconPath: string;
    title: string;
    tabIdentifier: NAVIGATION_TAB;
    app: App;

    onclick: () => void;

    constructor(
        iconPath: string,
        tabIdentifier: NAVIGATION_TAB,
        title: string,
        app: App
    ) {
        this.iconPath = iconPath;
        this.tabIdentifier = tabIdentifier;
        this.title = title;
        this.onclick = () => {
            Config.getSettings().selectedTab = this.tabIdentifier;
            Config.saveSettings();
        };
        this.app = app;
    }
}

export abstract class Sortable extends DanglingNavigationItem {
    sort(unsorted: Map<string, Dangle[]>): [string, Dangle[]][] {
        let settings = Config.getSettings();
        if (settings.sortOrder == SORT_ORDER.ASC) {
            return Array.from(unsorted).sort((a, b) =>
                a[0].localeCompare(b[0])
            );
        } else {
            return Array.from(unsorted).sort((a, b) =>
                b[0].localeCompare(a[0])
            );
        }
    }

    abstract getDanglingLinks(): Map<string, Dangle[]>;
}
