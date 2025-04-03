// postcss.config.ts
import type { Config } from 'postcss'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import nesting from 'postcss-nesting'
import cssnano from 'cssnano'

const config: Config = {
  plugins: [
    nesting(),
    tailwindcss,
    autoprefixer,
    cssnano({ preset: 'default' }),
  ],
}

export default config