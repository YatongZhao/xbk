export function formatTime (create_time = Date.now() - 60000) {
  let timeDiff = Number(Date.now()) - Number(new Date(create_time.replace(/-/g, '/')))
  let timeStr = timeDiff < 1000 * 60
    ? `${Math.floor(timeDiff / 1000)}秒前`
    : timeDiff < 1000 * 60 * 60
      ? `${Math.floor(timeDiff / 1000 / 60)}分钟前`
      : timeDiff < 1000 * 60 * 60 * 36
        ? `${Math.floor(timeDiff / 1000 / 60 / 60)}小时前`
        : `${Math.floor(timeDiff / 1000 / 60 / 60 / 24)}天前`
  return timeStr
}
