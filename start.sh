#!/bin/bash

npm link 
echo "{\"channel\": \"#foobarbar\"}" > bot-config.json
goldbot bot-config.json