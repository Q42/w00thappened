#!/bin/sh
java -jar closure-compiler-v20190729.jar --language_in ECMASCRIPT_2017 --compilation_level ADVANCED_OPTIMIZATIONS --language_out ES5 --module_resolution BROWSER --js ./js/*.js --process_common_js_modules --js_output_file w00thappened.min.js
