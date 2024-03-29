module.exports = {
    presets: [
        [ '@babel/preset-env', { targets: { esmodules: true } } ],
        [ '@babel/preset-react', { runtime: 'automatic' } ],
    ],
    // fix import meta Error for testing enviroment
    plugins: [
        function () {
            return {
                visitor: {
                    MetaProperty(path) {
                        path.replaceWithSourceString('process')
                    },
                },
            }   
        },
    ]
};