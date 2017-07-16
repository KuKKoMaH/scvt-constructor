export default ( stage ) => {
  stage.children.sort(function ( a, b ) {
    const zA = a.zIndex || 0;
    const zB = b.zIndex || 0;
    if (zA === zB) return 0;
    return zA > zB ? 1 : -1;
  });
};
