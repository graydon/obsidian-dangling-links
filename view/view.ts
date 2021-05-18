import Dangling from './Dangling.svelte';
import { VIEW_TYPE_DANGLING_LINKS } from '../constants';
import type Dangle from '../model/dangle';
import { ItemView, MarkdownView, TFile, WorkspaceLeaf } from 'obsidian';
import { Config } from '../service/config';
import type DanglingNavigationItem from 'controller/navigationItem';
import type { Sortable } from 'controller/navigationItem';
import DanglingFolderItem from 'controller/folderItem';
import DanglingFileItem from 'controller/fileItem';
import DanglingLinkItem from 'controller/linkItem';
import DanglingSortItem from 'controller/sortItem';

export default class DanglingLinksView extends ItemView {
    private dangling: Dangling;
    private navigationItems: DanglingNavigationItem[];
    private sortableItems: Sortable[];

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.redraw = this.redraw.bind(this);
        this.visitDangle = this.visitDangle.bind(this);
        this.registerEvent(this.app.metadataCache.on('resolved', this.redraw));
        this.registerEvent(this.app.metadataCache.on('changed', this.redraw));
        this.sortableItems = [
            new DanglingFolderItem(this.app),
            new DanglingFileItem(this.app),
            new DanglingLinkItem(this.app),
        ];
        this.navigationItems = [
            ...(this.sortableItems as DanglingNavigationItem[]),
            new DanglingSortItem(this.app),
        ];
    }

    getViewType(): string {
        return VIEW_TYPE_DANGLING_LINKS;
    }

    getDisplayText(): string {
        return 'Dangling links';
    }

    getIcon(): string {
        return 'broken-link';
    }

    onClose(): Promise<void> {
        if (this.dangling) {
            this.dangling.$destroy();
        }
        return Promise.resolve();
    }

    visitDangle(dangle: Dangle) {
        let file = this.app.vault.getAbstractFileByPath(dangle.path);
        if (file instanceof TFile) {
            let leaf: WorkspaceLeaf = this.app.workspace.getUnpinnedLeaf();
            leaf.openFile(file).then(() => {
                if (leaf.view instanceof MarkdownView) {
                    this.app.workspace.setActiveLeaf(leaf, true, true);
                    leaf.view.editor.setCursor(dangle.line, dangle.col);
                }
            });
        }
    }

    async onOpen(): Promise<void> {
        let dangling = this.getDangling();
        this.dangling = new Dangling({
            target: (this as any).contentEl,
            props: {
                visitDangle: this.visitDangle,
                redraw: this.redraw,
                dangling,
                sortableItems: this.sortableItems,
                navigationItems: this.navigationItems,
            },
        });
    }

    public async redraw(): Promise<void> {
        let dangling = this.getDangling();
        this.dangling?.$set({ dangling });
    }

    private getDangling(): [string, Dangle[]][] {
        let settings = Config.getSettings();
        let activeNavigation = this.sortableItems.find(
            (element) => element.tabIdentifier == settings.selectedTab
        );
        return activeNavigation.sort(activeNavigation.getDanglingLinks());
    }
}
