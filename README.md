# Book Publishing Workflow System
Basic HTML + CSS + JavaScript project (CA1). Tracks manuscripts through 6 stages:
Submission > Editing > Proofreading > Cover Design > Review > Publication.

Features: manuscripts, authors, editors, stages, comments, revision status, approval, publication status, search and stage filter. Data is saved in the browser with localStorage.

## Workflow rules
1. A new manuscript starts at Submission with status "In Progress".
2. The editor can Approve it or Request Revision.
3. After a revision request, the author clicks Mark Revised (status goes back to In Progress) and the editor approves again.
4. "Move To Next Stage" works only when the status is Approved. The new stage starts as In Progress.
5. "Publish" works only at the Publication stage after approval.

## Files
- index.html: page structure (menu, forms, tables, details panel)
- style.css: colours, layout, tables, stage boxes, small-screen rules
- script.js: all logic (sections are numbered 1 to 8 in the file)

## Deploy on GitHub Pages
1. New GitHub repo, upload all four files.
2. Settings > Pages > Deploy from a branch > main > / (root) > Save.
3. Link: https://YOUR-USERNAME.github.io/REPO-NAME/ (open it and test).

## How the code works (for the viva)
- **Arrays and objects:** `authors`, `editors`, `manuscripts` are arrays; each item is an object, e.g. `{id, title, authorId, editorId, stage, revision, published, comments}`.
- **Stage:** a number 0 to 5 that points into the `stages` array. Next stage = `stage + 1`.
- **Revision status:** a text: In Progress, Revision Requested or Approved.
- **Publication status:** worked out by `getPublicationStatus()` from stage, revision and `published`.
- **localStorage:** `saveData()` turns the arrays into text with `JSON.stringify`; `loadData()` turns them back with `JSON.parse`. Data survives a refresh.
- **Showing data:** `showManuscripts()`, `showAuthors()` etc. loop through an array, build an HTML string and put it in the page with `innerHTML`. `refreshAll()` calls all of them.
- **Buttons:** `onclick="approveStage()"` in the HTML calls the function of the same name in script.js.
- **Pages:** `showPage()` hides all three divs, then shows one with `style.display`.
- **Search/filter:** `showManuscripts()` checks `indexOf` on the title and compares the stage with the dropdown.
- **safe():** replaces < and > so typed text cannot inject HTML.
- **Responsive:** table inside `overflow-x:auto`, flex-wrap on stage boxes, `@media (max-width:600px)`.

## Likely viva questions
1. Why 6 stages? They match the problem statement (submission, editing, proofreading, cover design, review, publication).
2. How do you stop skipping a stage? The `if` in `nextStage()` checks the revision is Approved.
3. Where is data stored? Browser localStorage, so there is no backend.
4. What is the difference between `==` and `=`? `=` stores a value; `==` compares.
5. What does `refreshAll()` do and why call it after every change? It redraws every table from the arrays so the screen matches the data.
6. How does a comment get its stage and date? `addLog()` copies `stages[m.stage]` and today's date.
7. How would you add a new stage? Add its name to the `stages` array. Change the number 5 (last stage) in `nextStage()`, `publishBook()` and `getPublicationStatus()`.
8. How would you add a "deadline" field? Add an input in index.html, save it in `addManuscript()`, show it in `showManuscripts()`.

## Team contribution (fill before submitting)
Member 1 (HTML structure and forms): ____
Member 2 (CSS and responsive layout): ____
Member 3 (JavaScript logic and deployment): ____

## Video script (5 to 6 minutes, everyone speaks)
1. Member 1: problem (many people, many stages, manuscripts get lost) and the solution.
2. Member 2: demo: add manuscript, assign editor, comment, request revision, mark revised, approve, move through stages, publish, search and filter, Authors and Editors pages.
3. Member 3: technologies (HTML, CSS, JS, localStorage, GitHub Pages) and a quick look at script.js.
4. All: what each member built, then the key outcomes.
