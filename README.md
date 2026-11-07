# Sheet Music Playground

A dependency-free sheet music game based on Piano Playground's design and rules. Open `index.html` in a modern browser. No build or installation is needed.

- **Name the note:** read a note on the staff and choose one of four solfège names.
- **Place the note:** tap a line or space, or use Lower / Higher, choose an accidental when enabled, then press Check note. Any octave of the requested name counts, including positions outside the question range. Accidentals must match the requested spelling.
- Choose Sol (treble) or Fa (bass) clef, an inclusive question range from Do2–Si6, and natural notes or sharps/flats. Octave 4 starts at middle Do. Switching clefs resets the range to a useful default.
- 10 questions per round, 10 seconds each, 1,000 points for a correct answer plus up to 200 speed points. Wrong answers and timeouts earn zero. Correct feedback lasts 1 second; corrections last 2.4 seconds.
- Piano-like sound plays after answering; Sound on/off controls audio. The question is silent so this remains a reading exercise.
- Settings stay fixed during a round. Play again repeats the settings; Change game returns to setup.

The staff expands to include the question range and the clef's usual staff area. Ledger lines appear as needed. Natural semitone gaps are preserved; chromatic questions use conventional sharps and flats (without Mi♯, Si♯, Do♭, or Fa♭).

## Local preview

Run `python3 -m http.server 8765` in this folder, then visit http://localhost:8765.

## Checks

Run `node --check game.js` and `node tests/game.test.cjs`. The logic harness covers both modes, clefs, and accidental settings, full rounds, octave matching, scoring, wrong answers, timeouts, and range validation. It uses a simulated DOM; browser checks separately verified treble rendering, bass rendering and placing Do in another octave. Audio listening and mobile hardware interaction have not been verified.
