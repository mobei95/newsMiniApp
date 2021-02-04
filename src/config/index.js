console.log('tt.env.VERSION', tt.env.VERSION)
export const baseURL = tt.env.VERSION === 'production' ? 'https://api.wihudong.com' : 'http://cf.wihudong.com'

export const fileHost = 'https://xhn.wihudong.com/'