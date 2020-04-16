export const Polling = (fn = () => {}, interval) => {
  const timer = setInterval(() => {
    fn(timer)
  }, interval)
}
