let fs = require('fs'),
    path = require('path');

let argv = require('minimist')(process.argv.slice(2));
// console.log(argv);

let config = {
    raw: '.ORF',
    img:  '.JPG'
};


function onError(msg, err) {
    console.log('Error\n%s', msg);
    if (err) console.log(err);
    console.log('Usage: node index.js [--path] {directory} [--del]');
    process.exit();
}

let dir = argv.dir || argv._[0];
let del = argv.del || false;
if (!dir) { onError("Missing argument path");}


fs.readdir(dir, function(err, items) {
    if (err) {
        return onError("Path doesn't exist", err);
    }
    let raws = items.filter(function (item) {
        return path.parse(path.join(dir, item)).ext == config.raw;
    });

    let orphans = raws.filter(function(item){
        return items.indexOf(item.replace(config.raw, config.img)) === -1;
    });

    console.log('Raw files: ', raws.length);
    console.log('Raw without matching JPG: ', orphans.length);

    if (del) {
        orphans.forEach(function(item) {
            let file =  path.join(dir, item);
            console.log('Deleting: ', file);
            fs.unlinkSync(file);
        });
    } else {
        console.log(orphans);
        console.log('info: To delete this files pass the flag --del');
    }
});
