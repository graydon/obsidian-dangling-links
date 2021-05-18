import type Dangle from 'model/dangle';
import type { App } from 'obsidian';
import { ICONS, NAVIGATION_TAB } from '../constants';
import { Sortable } from './navigationItem';

export default class DanglingLinkItem extends Sortable {
    constructor(app: App) {
        super(
            ICONS.LINK_ICON,
            NAVIGATION_TAB.LINK,
            'Group by dangling link',
            app
        );
    }

    getDanglingLinks(): Map<string, Dangle[]> {
        let danglingLinks: Map<string, Dangle[]> = this._getDanglingLinks(
            (dangle: Dangle) => dangle.link
        );
        return danglingLinks;
    }
}
