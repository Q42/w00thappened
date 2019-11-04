#!/bin/sh

#!/bin/sh

targetjs="./w00thappened.min.js"

cat ./LICENSE > $targetjs

echo "(function(){" >> $targetjs
java -jar closure-compiler-v20190729.jar --language_in ECMASCRIPT_2017 --language_out ES5 --compilation_level ADVANCED_OPTIMIZATIONS --module_resolution BROWSER --js ./js/*.js --process_common_js_modules --js_output_file $targetjs.tmp
cat $targetjs.tmp >> $targetjs
echo "})()" >> $targetjs

rm $targetjs.tmp
