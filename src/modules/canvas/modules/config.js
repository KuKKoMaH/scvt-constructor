export default {
  MINIMAL_SIZE:          window.MINIMAL_SIZE || 5,           // минимальный размер картины в см
  SIZE_STEP:             window.SIZE_STEP || 5,              // шаг для изменения размера картины
  PIXELS_IN_CENTIMETRE:  window.PIXELS_IN_CENTIMETRE || 3.5, // кол-во пикселей в 1 см при масштабе 1
  PICTURE_SIZE:          window.PICTURE_SIZE || 70,          // размер картины в см
  PICTURE_X:             window.PICTURE_X || 0,              // смещение относильно центра в см
  PICTURE_Y:             window.PICTURE_Y || 0,
  BACKGROUND_WIDTH:      1650,                               // оригинальный размер фона
  BACKGROUND_HEIGHT:     950,
  BORDER_OFFSET:         6,                                  // отступ рамки от краев картины
  BORDER_WIDTH:          8,                                  // ширина границы
  BORDER_OPACITY:        .1,                                 // видимость границы
  BORDER_ACTIVE_OPACITY: .4,                                 // видимость границы при наведении
};
