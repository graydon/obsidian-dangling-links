# obsidian-dangling-links

This is a small plugin for [Obsidian](http://obsidian.md) that displays the set
of dangling links in your current vault in a side-panel -- links you've put in
a note somewhere that don't currently point to anything in the vault.

Dangling links may be typos or they may be links you intended to make a note for
but forgot to get to. Either way, it can be nice to have a list of them to work
with.

## Usage

The panel is accessed with the "Dangling links: Open view" command, or by
clicking the broken-link ribbon icon. Dangling links are grouped by the file
they occur in, and you can click each occurrence (unfortunately you must click
_twice_) to navigate to it.

## Bugs

  - You have to click on each occurrence twice to scroll to the right line.
  - You have to make one edit _after_ fixing a dangling link before the list of
    dangling links will update.

I have no idea why either of these bugs exist but UI programming is a bit of a
mystery to me in general. Patches welcome.

## Compatibility

I've marked this as requiring obsidian v0.9.15 because that's what I have. If
you get it working on an earlier one, I'm happy to reduce that number. I don't
have a lot of time to spend testing versions though and I don't see a big reason
to stick with old versions.