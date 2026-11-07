# Pick Individual Skills

Run `sauron init`, choose Custom, then choose Pick departments and skills. In the numbered
fallback, enter `pick` at the Skills prompt.

## Flow

1. Select departments. Each newly opened department starts with every skill checked.
2. Select the skills inside each chosen department. Labels and hints come from frontmatter.
3. Choose Pick another department, Done, or Back to departments.
4. Review the install plan and confirm before any config or runtime files change.

The picker retains checked subsets when you revisit a department. Unchecking a department
removes its draft choices. Deselecting every skill in a department keeps that department empty
on a revisit during the same picker session. If the final selection is empty, the config stores
`skills: none`.

Saved individual choices preselect the same skills when you open Custom picking again. A saved
department entry starts with all its current skills checked. Choosing Pick from an all-skills
preset starts with no departments selected, so you choose which departments to narrow.

## Arrow controls

- Up and Down move the cursor. Space toggles an entry. Enter confirms the list.
- Backspace in a skill list returns to departments and discards that list's pending changes.
- The navigation menu also offers Back to departments and Pick another department.
- Escape or Ctrl+C cancels setup. No selection or installation state is saved.

Descriptions load only for departments you open.

## Numbered controls

Select departments and skills with comma-separated numbers or exact ids. The skill list shows
its `department/skill` ids beside display names. Use `all` or `none` for the whole current list.

Enter `back` or `0` in a skill list to return to departments. Enter `cancel` at a picker prompt
to abort setup. The next-action menu offers another department, Done, and Back.

## Saved config and script flags

Unchecking a skill changes the saved plan. Skills already on disk remain in place. Removal belongs
to the install lifecycle commands in the next phase.

The picker saves explicit checked ids, even when every current skill in a department is checked.
A later addition to that department does not install until you select it. Department selectors
in config or flags continue to include the full department.

```bash
sauron init --yes --skills=security,workflow/caveman
```

Use real department and skill ids from `sauron list-skills`. Invalid ids fail before writes.
The installer deduplicates overlaps between a department and an individual entry.

## Verification

Automated tests exercise the shared picker state, numbered input, and scripted arrow streams.
Check actual terminal rendering, key handling, cancellation, and exit in Git Bash and PowerShell
before treating real-terminal behavior as verified.
