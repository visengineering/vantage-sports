export const scrollOnClick = (id: string, yOffset: number = -100) => {
  const element = document.getElementById(id);
  if (!element) return;
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: 'smooth' });
};
