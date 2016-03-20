# switch-import

### change your batch import into multiple line imports from .js files

run
```
$ npm install switch-import
$ node node_modules/switch-import/main
```
will change your:
```
import {get, result, set, kababCase} from 'lodash';
```
to
```
import get from 'lodash/get';
import kababCase from 'lodash/kababCase';
import result from 'lodash/result';
import set from 'lodash/set';
```

### Options
* `-src` - target directory (_default: 'src'_) | usage: `node node_modules/switch-import/main -src temp_dir`
* `-from` - module name (_default: 'lodash'_) | usage: `node node_modules/switch-import/main -from jquery`

### usage
`$ node node_modules/switch-import/main`

`$ node node_modules/switch-import/main -src temp_dir`

`$ node node_modules/switch-import/main -from jquery`

`$ node node_modules/switch-import/main -src temp_dir -from jquery`
