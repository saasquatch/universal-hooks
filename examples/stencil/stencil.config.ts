import { Config } from '@stencil/core';
import alias from "@rollup/plugin-alias"

export const config: Config = {
  namespace: 'universal-hooks-test',
  rollupPlugins: {
    before: [
      alias({
        entries: [
          { 
            find: '@saasquatch/universal-hooks',
            replacement: '@saasquatch/stencil-hooks',
          }
        ]
      })
    ],
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
