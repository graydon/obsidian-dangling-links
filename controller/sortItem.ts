import DanglingNavigationItem from './navigationItem';
import { ICONS, NAVIGATION_TAB, SORT_ORDER } from '../constants';
import { Config } from '../service/config';
import type { App } from 'obsidian';

export default class DanglingSortItem extends DanglingNavigationItem {
    constructor(app: App) {
        super(ICONS.SORT_ICON, NAVIGATION_TAB.SORT, 'Change sort order', app);
        this.onclick = () => {
            let settings = Config.getSettings();
            settings.sortOrder =
                settings.sortOrder == SORT_ORDER.ASC
                    ? SORT_ORDER.DESC
                    : SORT_ORDER.ASC;
            Config.saveSettings();
        };
    }
}
