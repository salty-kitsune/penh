export default function getHighestZindex() {
  const elementNodes = document.querySelectorAll('body *');
  const zIndexes = Array.from(elementNodes).map(
    (el) => parseInt(window.getComputedStyle(el).zIndex) || 0
  );

  return Math.max(...zIndexes);
}
