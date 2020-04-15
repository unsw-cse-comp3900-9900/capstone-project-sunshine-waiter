export const Polling = (fn = () => {}, interval) => {
  setInterval(() => {
    fn()
  }, interval)
}
