export default class Dangle {

    constructor(lnk: string, ln: number, cl: number) {
        this.link = lnk;
        this.line = ln;
        this.col = cl;
    }

    // The putative name of the link (that points nowhere)
    public link: string;

    // The line number of the offending link.
    public line: number;

    // Column of the offending link.
    public col: number;
}
