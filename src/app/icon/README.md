# Adding new icons

It's pretty straight forward: all you need is an _SVG_ file!

## Steps

1. Create an _SVG_ file (you can use Illustrator or any other vector graphic tool):

   - Please make sure it fits within **15 x 15 px** square.
   - For best rendering please align as many lines to the pixel grid as you can.

2. Copy the _SVG_ definition into: `svg-definitions.component.html` (Note: Add at the bottom of the file for easier tracking of changes)

3. Create a _unique and descriptive name_ for your icon.

4. Reference the icon in any template with `<app-icon [icon]="'your-icon-name'">`
   - If it's an icon for a button, just add the icon name to the `iconName` field in the relevant button in `settings-buttons.ts`
5. Open a PR (Pull Request) with the changes.
