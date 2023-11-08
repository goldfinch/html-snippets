import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import autoprefixer from "autoprefixer";
// import * as path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import initCfg from './app.config.js'

export default defineConfig(({ command, mode, ssrBuild }) => {

  const cfg = initCfg(command, mode, ssrBuild)

  // const host = cfg.host;

  // fs.writeFileSync('app.config.json', JSON.stringify(cfg.public));

  return {

    esbuild: {
      // charset: 'ascii' // fixing issue with unicode HTML entities in content: '';
    },

    resolve: {
        alias: {}
    },

    build: {
      chunkSizeWarningLimit: 1500,
      emptyOutDir: true,
      outDir: '../dist',
      rollupOptions: {
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `js/[name]-[hash].js`,
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith('.css')) {
              return '[name][extname]'
            } else if (
              assetInfo.name.match(/(\.(woff2?|eot|ttf|otf)|font\.svg)(\?.*)?$/)
            ) {
              return 'fonts/[name][extname]'
            } else if (assetInfo.name.match(/\.(jpg|png|svg)$/)) {
              return 'images/[name][extname]'
            }

            return 'js/[name][extname]'
          },
          // manualChunks(id) {
          //     if (id.includes('node_modules')) {
          //         return id.toString().split('node_modules/')[1].split('/')[0].toString();
          //     }
          // }
        }
      }
    },

    plugins: [

      laravel({
        input: [
          'src/content-component.js',
          'src/sass/component.scss',
        ],
        refresh: true,
        // buildDirectory: '',
      }),

      viteStaticCopy({
        targets: [
          {
            src: './src/images/*',
            dest: '../dist/images',
          },
        ],
      })
    ],

    css: {

      // preprocessorOptions: {
      //   scss: {
      //     additionalData: cfg.sassAdditionalData,
      //   },
      // },
      postcss: {
        plugins: [
          autoprefixer,
        ],
      }
    },
  }

});
