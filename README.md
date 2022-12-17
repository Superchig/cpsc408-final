# cpsc408-final

- Christopher Chang
- 2344338
- chrichang@chapman.edu
- CPSC 408-01
- Final Project

## Database Location

We use sqlite, and our database is located in `database.db`.

The SQl required to set up our database is in `schema.sql`.

## Build / Running Instructions

To run this locally, you need installed:
- [`node`](https://nodejs.org/en/) (I used version 18.12.0, later versions
  should be fine)

Once `node` is installed, you can run the project locally with:

```bash
npm install # Install node-specific libraries, only need this once
npm run dev # Start the server
```

The terminal should then tell you the project's local URL. It's usually
http://localhost:5174.

## References

- https://dirtsimple.org/2010/11/simplest-way-to-do-tree-based-queries.html
- https://navillus.dev/blog/svelte-class-props
- https://stackoverflow.com/questions/1897352/sqlite-group-concat-ordering
- https://stackoverflow.com/questions/4967135/deleting-rows-from-sqlite-table-when-no-match-exists-in-another-table
- https://stackoverflow.com/questions/74020726/how-to-shutdown-gracefully-in-sveltekit
- https://stackoverflow.com/questions/7939137/what-http-status-code-should-be-used-for-wrong-input
- https://www.sqlite.org/lang_returning.html
- https://www.sqlitetutorial.net/sqlite-functions/sqlite-coalesce/
