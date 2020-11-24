import { App, ItemView, Modal, Notice, Plugin, PluginSettingTab, Setting, View, WorkspaceLeaf } from 'obsidian';
import DanglingLinksView from "./view"
import { VIEW_TYPE_DANGLING_LINKS } from "./constants"

export default class DanglingLinkPlugin extends Plugin {

	private view: DanglingLinksView;

	onload() {
		this.registerView(VIEW_TYPE_DANGLING_LINKS,
						  (leaf: WorkspaceLeaf) =>
						      this.view = new DanglingLinksView(leaf))
		this.addCommand({
            id: "show-dangling-links-view",
			name: "Open view",
			callback: () => this.showPanel()
		});

		this.addRibbonIcon("broken-link",
		                   "Show dangling links panel",
		                   (e)=> this.showPanel());
	}

	showPanel() {
		this.app.workspace.getRightLeaf(true)
					      .setViewState({type: VIEW_TYPE_DANGLING_LINKS});
	}

	onunload() {
		this.app.workspace
			.getLeavesOfType(VIEW_TYPE_DANGLING_LINKS)
			.forEach((leaf) => leaf.detach());
	}
}
