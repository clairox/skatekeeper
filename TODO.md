# TODO.md

### Todo

- [ ] App settings
- [ ] UI design
- [ ] Redos
- [ ] Move store action logic into set() scope
- [ ] Use uuidv4 for history ids

### In Progress

- [ ] Game
    - [x] Refactor /game subroutes into a single consolidated endpoint
    - [ ] Move history management from context into custom hook
    - [x] Relocate game state logic to /game root component
- [ ] Game history
    - [ ] Continue unfinished game
    - [x] Delay history record initialization until play phase
    - [x] Delete individual history records
    - [x] Clear incomplete
    - [x] Clear history
    - [ ] Use uuid instead of number

### Done

- [x] Migrate game state management to Zustand
- [x] Update routes (/game, /game/setup, /game/play, /game/done)
- [x] Prevent user from going back in /game route
