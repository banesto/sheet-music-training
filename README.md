# Sheet Music Playground

**[Play Sheet Music Playground →](https://banesto.github.io/sheet-music-training/)**

Practice reading and placing sheet music with Do, Re, Mi, Fa, Sol, La, and Si. Play directly in your browser—no installation needed. The game follows Piano Playground’s visual style and scoring rules.

## How to play

Choose a game, clef, note range, and whether to include sharps and flats, then start a round.

- **Name the note:** read the note on the staff and choose its name from four answers.
- **Place the note:** click or tap a line or space to answer immediately. When accidentals are enabled, choose flat, natural, or sharp before placing the note. Keyboard users can focus a staff position and press Enter or Space.

Any octave of the requested note within the active range counts, with the requested accidental spelling. Correct placements turn green exactly where you placed them. After a mistake, the green correction shows the nearest matching note within the active range; equal-distance ties use the lower position. The feedback sound follows the displayed correct note.

Red areas are outside the active range and cannot be selected. Short ledger guides above and below the five staff lines help locate notes; hovering or focusing a position highlights the ledger lines needed for it.

## Clefs and ranges

Choose **Sol (treble)** or **Fa (bass)** clef. **Central staff** is selected by default. Changing clefs keeps the range category and updates the note labels. Octave 4 begins at middle Do.

| Range | Sol · Treble | Fa · Bass |
| --- | --- | --- |
| Central staff | Do4–Sol5 | Mi2–Si3 |
| Upper octave | Re5–Do6 | Fa3–Mi4 |
| Lower octave | Sol3–Fa4 | Si1–La2 |

The upper and lower ranges each contain seven note names, excluding the repeated octave endpoint. Choose natural notes only, or include conventional sharps and flats. Mi♯, Si♯, Do♭, and Fa♭ are excluded.

## Rounds and feedback

- **10 questions**, with **10 seconds per question**.
- **1,000 points** per correct answer, plus up to **200 speed points**. Wrong answers and timeouts earn zero.
- Correct feedback lasts 1 second; corrections last 2.4 seconds.
- Results show correct answers, total thinking time, and points, with encouragement suited to the score. Perfect-score praise is reserved for 10/10.

Questions are silent to focus on reading. A piano-like tone plays after answering; use **Sound on/off** to control it. Settings stay fixed during a round. **Play again** repeats the settings, **Change game** returns to setup, and **End round** leaves the current round.

## Development and checks

The game uses plain HTML, CSS, and JavaScript with no runtime dependencies or build step. GitHub Pages serves the repository root from `main`; pushing to `main` updates the published game.

Run the checks with:

```sh
node --check game.js
node tests/game.test.cjs
```

The simulated DOM tests cover both modes and clefs, accidental settings, complete rounds, scoring, timeouts, immediate placement submission, octave matching, all range presets, inactive placement areas, nearest-note corrections, and result messages. Earlier browser checks verified treble and bass rendering and placement in another octave. Audio listening and mobile hardware interaction remain unverified.
