import Cookies from 'js-cookie'

export function intercept () {
  let suv = Cookies.get('suv')

  if (suv) return false
  this.props.history.replace('/add_follow')
}
