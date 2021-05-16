export default class Dangle {
    constructor(
        path: string,
        filename: string,
        lnk: string,
        ln: number,
        cl: number
    ) {
        this.path = path;
        this.filename = filename;
        this.link = lnk;
        this.line = ln;
        this.col = cl;
    }

    // The file name of the originating file
    public path: string;

    // The file name of the originating file
    public filename: string;

    // The putative name of the link (that points nowhere)
    public link: string;

    // The line number of the offending link.
    public line: number;

    // Column of the offending link.
    public col: number;
}
