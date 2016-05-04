const del = require('del');

del(['src/**/*.js', 'src/**/*.map', 'tests/**/*.js', 'tests/**/*.map', 'public/']).then((paths) => {
    if(!paths.length) {
        console.log('Nothing deleted');
        return;
    }
    console.log('Cleaned:\n', paths.join('\n'));
});
