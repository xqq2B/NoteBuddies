const {createLogger,format,transports} = require ('winston');

module.exports = createLogger ({
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(info => '['+info.timestamp+'] ' + info.level +': '  + info.message)
        ),
    transports:[
        new transports.File({
            maxsize: 1000000,//1mb
            maxFiles: 3,
            filename: 'src/lib/logs/lognoteBuddies.txt',
            level:'debug',
        }),
        new transports.Console({
            level:'debug',
        })
    ]
});
