export function drawAudioWave (channelData: any, ctx: any) {
  if (!ctx) return
  ctx.clearRect(0, 0, 204, 204);

  for (var i = 0; i < 51; i++) {
    var 
    z = Math.round(channelData.length / 68) * i,
    x1 = i * 4,
    y = Math.abs(channelData[z]) * 504,
    y1

    if (i >= 0 && i <= 10) {
      y += Math.round(y * 0.2)
    } else { 
      if (i > 10 && i <= 20){
        y += Math.round(y * 0.5)
      } else {
        if (i > 20 && i <= 25) {
          y += y;
        } else {
          if (i == 26) {
            y += y;
          } else {
            if (i > 26 && i <= 31) {
              y += y;
            } else {
              if (i > 31 && i <= 41) {
                y += Math.round(y * 0.5)
              } else {
                if (i > 41 && i <= 51) {
                  y += Math.round(y * 0.2)
                }
              }
            }
          }
        }
      }
    }

    y1 = 78 - Math.abs(y / 2)
    
    const gradient = ctx.createLinearGradient(0, 0, 0, y)

    gradient.addColorStop(0, '#ccf5fb')
    gradient.addColorStop(0.45, '#FFFFFF')
    gradient.addColorStop(0.55, '#FFFFFF')
    gradient.addColorStop(1, '#ccf5fb')

    ctx.fillStyle = gradient
    ctx.fillRect(x1, y1, 3, y)
  }
}