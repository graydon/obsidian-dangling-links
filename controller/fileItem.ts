import type Dangle from 'model/dangle';
import type { App } from 'obsidian';
import { ICONS, NAVIGATION_TAB } from '../constants';
import { Sortable } from './navigationItem';

export default class DanglingFileItem extends Sortable {
    constructor(app: App) {
        super(
            ICONS.FILE_ICON,
            NAVIGATION_TAB.FILE,
            'Group by note containing dangling link',
            app
        );
    }

    getDanglingLinks(): Map<string, Dangle[]> {
        let danglingLinks: Map<string, Dangle[]> = this._getDanglingLinks(
            (dangle: Dangle) => dangle.path
        );
        return danglingLinks;
    }
}
