import Dangle from '../model/dangle';
import { NAVIGATION_TAB, SORT_ORDER } from '../constants';
import { Config } from '../service/config';
import { App, CachedMetadata, getLinkpath, TFile } from 'obsidian';

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

    protected _getDanglingLinks(
        indexer: (dangle: Dangle) => string = (dangle: Dangle) => dangle.path
    ): Map<string, Dangle[]> {
        let dangles: Dangle[] = [];
        let danglingLinks: Map<string, Dangle[]> = new Map<string, Dangle[]>();
        let ignoredFolders = Config.getSettings().ignoredFolders;
        for (let file of this.app.vault.getMarkdownFiles()) {
            if (
                ignoredFolders.find((ignoredFolder) =>
                    file.path?.startsWith(ignoredFolder + '/')
                )
            ) {
                continue;
            }
            let meta: CachedMetadata =
                this.app.metadataCache.getFileCache(file);
            if (meta.links) {
                for (let link of meta.links) {
                    let linkPath = getLinkpath(link.link);

                    // Try to resolve `SomeTargetFile` from context of file.path
                    let target: TFile =
                        this.app.metadataCache.getFirstLinkpathDest(
                            linkPath,
                            file.path
                        );

                    //con.log(`examining link ${link.link} in ${file.path}`);
                    if (target == null) {
                        // con.log(`found dangling link ${link.link} in ${file.path}`);
                        dangles.push(
                            new Dangle(
                                file.path,
                                file.name,
                                link.link,
                                link.position.start.line,
                                link.position.start.col
                            )
                        );
                    }
                }
            }
        }
        dangles.forEach((dangle) => {
            let index = indexer(dangle);
            //index = index == '' ? this.app.vault.getName() : index;
            if (danglingLinks.has(index)) {
                var dangles = [...danglingLinks.get(index), dangle];
            } else {
                var dangles = [dangle];
            }
            // con.log(`adding ${dangles.length} dangling links for ${file.path}`);
            danglingLinks.set(index, dangles);
        });
        return danglingLinks;
    }

    abstract getDanglingLinks(): Map<string, Dangle[]>;
}
