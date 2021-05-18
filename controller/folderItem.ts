import type Dangle from 'model/dangle';
import type { App } from 'obsidian';
import { ICONS, NAVIGATION_TAB } from '../constants';
import { Sortable } from './navigationItem';

export default class DanglingFolderItem extends Sortable {
    constructor(app: App) {
        super(
            ICONS.FOLDER_ICON,
            NAVIGATION_TAB.FOLDER,
            'Group by folder containing notes with dangling links',
            app
        );
    }

    getDanglingLinks(): Map<string, Dangle[]> {
        let danglingLinks: Map<string, Dangle[]> = this._getDanglingLinks(
            (dangle: Dangle) =>
                dangle.path.substr(0, dangle.path.lastIndexOf('/'))
        );
        return danglingLinks;
    }
}
