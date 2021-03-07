# Natify

Web browser audio synthesizer.

The synthetizer is programmable with an inline javascript code editor.

Just return a float between -1 and 1, and the synthetizer will play it !
You can create sliders by adding comments that follow this scheme:

`//use SLIDER_NAME 0.0 to 1.0 by 0.1;`

## Demo

https://thomassimon.dev/natify/

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Warning

Javascript function `eval` is used to evaluate the sound function defined by the user. Do not copy paste untrusted code into the editor.
