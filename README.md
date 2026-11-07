# Sheet Music Playground

A dependency-free sheet music game based on Piano Playground's design and rules. Open `index.html` in a modern browser. No build or installation is needed.

- **Name the note:** read a note on the staff and choose one of four solfège names.
- **Place the note:** choose an accidental when enabled, then tap a line or space to submit immediately. Any octave of the requested name within the active range counts. Red areas outside the range cannot be selected. Accidentals must match the requested spelling.
- Choose Sol (treble) or Fa (bass) clef, a Central staff, Upper octave, or Lower octave range, and natural notes or sharps/flats. Central staff is the default. Treble ranges: Do4–Sol5, Do5–Do6, Sol3–Sol4. Bass uses the same positions relative to its staff: Mi2–Si3, Mi3–Mi4, Si1–Si2. Switching clefs preserves the range category and updates the note names.
- 10 questions per round, 10 seconds each, 1,000 points for a correct answer plus up to 200 speed points. Wrong answers and timeouts earn zero. Correct feedback lasts 1 second; corrections last 2.4 seconds.
- Piano-like sound plays after answering; Sound on/off controls audio. The question is silent so this remains a reading exercise.
- Settings stay fixed during a round. Play again repeats the settings; Change game returns to setup.

The staff expands to include the question range and the clef's usual staff area. Ledger lines appear as needed. Placement mode also shows short ledger guides above and below the staff; hovering or focusing a position highlights the lines needed for that position. Natural semitone gaps are preserved; chromatic questions use conventional sharps and flats (without Mi♯, Si♯, Do♭, or Fa♭).

## Local preview

Run `python3 -m http.server 8765` in this folder, then visit http://localhost:8765.

## Checks

Run `node --check game.js` and `node tests/game.test.cjs`. The logic harness covers both modes, clefs, and accidental settings, full rounds, octave matching, scoring, wrong answers, timeouts, and all range presets. It uses a simulated DOM; browser checks separately verified treble rendering, bass rendering and placing Do in another octave. Audio listening and mobile hardware interaction have not been verified.
