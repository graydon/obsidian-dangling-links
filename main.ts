import {
    Plugin,
    PluginSettingTab,
    Setting,
    View,
    WorkspaceLeaf,
} from 'obsidian';
import { Config } from 'service/config';
import DanglingSettingsTab from 'view/settings';
import DanglingLinksView from 'view/view';
import { VIEW_TYPE_DANGLING_LINKS } from './constants';

export default class DanglingLinkPlugin extends Plugin {
    public view: DanglingLinksView;

    async onload() {
        await Config.loadSettings(this);
        this.registerView(
            VIEW_TYPE_DANGLING_LINKS,
            (leaf: WorkspaceLeaf) => (this.view = new DanglingLinksView(leaf))
        );
        this.addCommand({
            id: 'show-dangling-links-view',
            name: 'Open view',
            callback: () => this.showPanel(),
        });

        this.addRibbonIcon('broken-link', 'Show dangling links panel', (e) =>
            this.showPanel()
        );
        this.addSettingTab(new DanglingSettingsTab(this.app, this));
    }

    showPanel() {
        this.app.workspace
            .getRightLeaf(true)
            .setViewState({ type: VIEW_TYPE_DANGLING_LINKS });
    }

    onunload() {
        this.app.workspace
            .getLeavesOfType(VIEW_TYPE_DANGLING_LINKS)
            .forEach((leaf) => leaf.detach());
    }
}
