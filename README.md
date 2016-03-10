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
import result from 'lodash/result';
import set from 'lodash/set';
import kababCase from 'lodash/kababCase';
```

### Options
* `-src` - target directory (default: 'src') | usage: `node node_modules/switch-import/main -src temp_dir`
* `-from` - module name (default: 'lodash') | usage: `node node_modules/switch-import/main -from jquery`
