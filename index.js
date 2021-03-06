'use strict';

const PLUGIN_NAME = 'HtmlWebpackCustomCallbackPlugin';
const defaultOptions = {
  callback: null
};

class HtmlWebpackCustomCallbackPlugin {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options)
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      const [HtmlWebpackPlugin] = compiler.options.plugins.filter(
                (plugin) => plugin.constructor.name === 'HtmlWebpackPlugin');
           
      HtmlWebpackPlugin.constructor.getHooks(compilation).beforeEmit.tapAsync(
        PLUGIN_NAME,
        (data, cb) => {
          data.html = this.invokeCallback(data.html);

          cb(null, data);
        }
      );
    });
  }

  invokeCallback(html) {
    if (typeof this.options.callback === 'function') {
      html = this.options.callback.call(null, html);
    }

    return html;
  }
}

module.exports = HtmlWebpackCustomCallbackPlugin;
