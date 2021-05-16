import Dangle from 'model/dangle';
import { App, CachedMetadata, getLinkpath, TFile } from 'obsidian';
import { Config } from 'service/config';
import { ICONS, NAVIGATION_TAB } from '../constants';
import { Sortable } from './navigationItem';

export default class DanglingLinkItem extends Sortable {
    constructor(app: App) {
        super(ICONS.LINK_ICON, NAVIGATION_TAB.LINK, 'Broken link', app);
    }

    getDanglingLinks(): Map<string, Dangle[]> {
        let danglingLinks: Map<string, Dangle[]> = new Map();
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
            let dangles: Dangle[] = [];
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
            if (dangles.length != 0) {
                dangles.forEach((dangle) => {
                    let index = dangle.link;
                    dangles = [dangle];
                    if (danglingLinks.has(index)) {
                        dangles = [...danglingLinks.get(index), dangle];
                    }
                    danglingLinks.set(index, dangles);
                });
                // con.log(`adding ${dangles.length} dangling links for ${file.path}`);
            }
        }
        return danglingLinks;
    }
}
