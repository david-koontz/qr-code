export default {
  build: {
    copyPublicDir: false,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
      },
      input: {
        'qr-code': '/src/qr-code'
      }
    }
  }
}