const webTitle = import.meta.env.VITE_WEB_TITLE

export default (pageTitle) => {
  return pageTitle ? `${pageTitle} - ${webTitle}` : `${webTitle}`
}
