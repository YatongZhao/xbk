function createUV () {
  let timeStr = Date.now()
  let Num = Math.random(0, 10000000)

  return `${timeStr}${Num}`
}


export default createUV
